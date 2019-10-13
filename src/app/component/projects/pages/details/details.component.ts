import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem, MenuLink } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIError } from "src/app/services/baw-api/base-api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editProjectMenuItem,
  projectMenuItem,
  projectsCategory
} from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      {
        kind: "MenuLink",
        uri: "/listen",
        icon: ["fas", "map"],
        label: "Explore audio",
        tooltip: () => "Explore audio"
      } as MenuLink,
      editProjectMenuItem,
      {
        kind: "MenuLink",
        uri: "REPLACE_ME",
        icon: ["fas", "key"],
        label: "Edit Permissions",
        tooltip: () => "REPLACE_ME"
      } as MenuLink,
      newSiteMenuItem
    ]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: projectMenuItem
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  project: Project;
  sites: Site[];
  errorCodes = this.sitesApi.apiReturnCodes;
  state = "loading";
  avgLat = 0;
  avgLong = 0;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
  ) {
    super();
  }

  ngOnInit() {
    console.debug("avgLat", this.avgLat);
    console.debug("avgLong", this.avgLong);
    this.route.params.subscribe({
      next: params => {
        this.projectsApi.getProject(params.projectId).subscribe({
          next: project => {
            this.project = project;
            this.state = "project";
          },
          error: (err: APIError) => {
            if (err.code === this.errorCodes.unauthorized) {
              this.state = "unauthorized";
            } else {
              this.state = "notFound";
            }
          }
        });

        this.sitesApi.getProjectSites(params.projectId).subscribe({
          next: sites => {
            // Calculate map lat and long
            sites.map(site => {
              // this.avgLat += site.customLatitude;
              // this.avgLong += site.customLongitude;
            });
            // this.avgLat /= sites.length;
            // this.avgLong /= sites.length;

            this.sites = sites;
          }
        });
      }
    });
  }
}
