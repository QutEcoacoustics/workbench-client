import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
} from "@components/projects/projects.menus";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { licenseWidgetMenuItem, permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { ToastService } from "@services/toasts/toasts.service";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { FormComponent } from "@shared/form/form.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { forkJoin } from "rxjs";
import { mergeMap, takeUntil } from "rxjs/operators";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

/**
 * TODO Extract this to Admin Dashboard. This will require a rewrite
 * of how this page works
 */
@Component({
  selector: "baw-assign",
  templateUrl: "./assign.component.html",
  styleUrl: "./assign.component.scss",
  imports: [
    DebouncedInputDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    FormComponent,
    ErrorHandlerComponent,
  ],
})
class AssignComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit
{
  private readonly notifications = inject(ToastService);
  protected readonly api: ShallowSitesService;

  public columns = [
    { name: "Site Id" },
    { name: "Name" },
    { name: "Description" },
  ];
  public sortKeys = { siteId: "id", name: "name" };
  public error: BawApiError;
  private oldSiteIds: Id[];

  public constructor() {
    const api = inject(ShallowSitesService);
    const route = inject(ActivatedRoute);

    super(
      api,
      (sites) =>
        sites.map((site) => ({
          siteId: site.id,
          name: site.name,
          description: site.descriptionHtmlTagline,
        })),
      route,
      undefined,
      (rows) => {
        this.project.siteIds.forEach((id) => {
          rows.forEach((row) => {
            if (id === row.siteId) {
              this.selected.push(row);
            }
          });
        });
      }
    );

    this.filterKey = "name";
  }

  public ngOnInit() {
    super.ngOnInit();
    this.oldSiteIds = Array.from(this.project.siteIds);
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  public onSubmit() {
    this.updateProjectSites();

    const newSiteIds = Array.from(this.project.siteIds);

    const removedSites = this.oldSiteIds.filter(
      (oldId) => !newSiteIds.some((id) => id === oldId)
    );

    const newSites = newSiteIds.filter(
      (newId) => !this.oldSiteIds.some((id) => id === newId)
    );

    // this is not related to baw-server/issues/502 because baw-api.service always emits the model kind
    // in the request body. Meaning that project_ids is retained in the request body.
    const createFilter = (site: Site) => this.api.update(site);

    // Workaround required because API ignores changes to project ids
    forkJoin<Site[]>([
      // Add project id to new site
      ...newSites.map((id) =>
        this.api.show(id).pipe(
          mergeMap((site) => {
            site.projectIds.add(this.project.id);
            return createFilter(site);
          })
        )
      ),
      // Remove project id from old sites
      ...removedSites.map((id) =>
        this.api.show(id).pipe(
          mergeMap((site) => {
            site.projectIds.delete(this.project.id);
            return createFilter(site);
          })
        )
      ),
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.notifications.success("Successfully update projects site list");
        },
        error: (err: BawApiError) => {
          this.error = err;
        },
      });

    // we initialize the the oldSiteIds variable in onInit
    // Because when the user submits they don't navigate, it's possible for multiple update requests in one page load
    // therefore, we update the oldSiteIds here so that the user can perform an action such as
    // select site > update > de-select same site > update
    // this would not be possible without updating the oldSiteIds here as oldSiteIds would only be updated on page load
    this.oldSiteIds = newSiteIds;
  }

  public getPageData() {
    this.updateProjectSites();
    super.getPageData();
  }

  private updateProjectSites() {
    this.rows?.forEach((row) => {
      if (this.selected.find((selection) => selection.siteId === row.siteId)) {
        this.project.siteIds.add(row.siteId);
      } else {
        if (this.project.siteIds.has(row.siteId)) {
          this.project.siteIds.delete(row.siteId);
        }
      }
    });
  }
}

AssignComponent.linkToRoute({
  category: projectCategory,
  pageRoute: assignSiteMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([
      permissionsWidgetMenuItem,
      licenseWidgetMenuItem,
    ]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { AssignComponent };

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
