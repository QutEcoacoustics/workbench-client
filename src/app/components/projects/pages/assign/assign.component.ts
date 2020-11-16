import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { defaultErrorMsg } from "@helpers/formTemplate/formTemplate";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Component({
  selector: "baw-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"],
})
class AssignComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  // TODO Move this back into the admin dashboard
  public columns = [
    { name: "Site Id" },
    { name: "Name" },
    { name: "Description" },
  ];
  public sortKeys = { siteId: "id", name: "name" };
  protected api: ShallowSitesService;

  constructor(
    private projectsApi: ProjectsService,
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

  public get project(): Project {
    return this.models.project as Project;
  }

  public onSubmit() {
    this.updateProjectSites();
    this.projectsApi
      .update(this.project)
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

AssignComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(assignSiteMenuItem);

export { AssignComponent };

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
