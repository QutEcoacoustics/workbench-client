import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { defaultErrorMsg } from "@helpers/formTemplate/formTemplate";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
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
  styleUrls: ["./assign.component.scss"],
})
class AssignComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit
{
  public columns = [
    { name: "Site Id" },
    { name: "Name" },
    { name: "Description" },
  ];
  public sortKeys = { siteId: "id", name: "name" };
  protected api: ShallowSitesService;
  private oldSiteIds: Id[];

  public constructor(
    siteApi: ShallowSitesService,
    private notifications: ToastrService,
    route: ActivatedRoute
  ) {
    super(
      siteApi,
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

    if (!this.failure) {
      this.oldSiteIds = Array.from(this.project.siteIds);
    }
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

    // Weird filter because of https://github.com/QutEcoacoustics/baw-server/issues/502
    const createFilter = (site: Site) =>
      this.api.update({
        id: site.id,
        site: { projectIds: Array.from(site.projectIds) },
      } as any);

    // Workaround required because API ignores changes to project ids
    forkJoin([
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
      .subscribe(
        () =>
          this.notifications.success("Successfully update projects site list"),
        (err: ApiErrorDetails) => this.notifications.error(defaultErrorMsg(err))
      );
  }

  public getPageData() {
    this.updateProjectSites();
    super.getPageData();
  }

  private updateProjectSites() {
    this.rows?.forEach((row) => {
      if (this.selected.find((selection) => selection === row)) {
        this.project.siteIds.add(row.siteId);
      } else {
        if (this.project.siteIds.has(row.siteId)) {
          this.project.siteIds.delete(row.siteId);
        }
      }
    });
  }
}

AssignComponent.linkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).andMenuRoute(assignSiteMenuItem);

export { AssignComponent };

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
