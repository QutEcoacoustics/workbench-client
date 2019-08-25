import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIError } from "src/app/services/baw-api/base-api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([editSiteMenuItem]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: siteMenuItem
})
@Component({
  selector: "app-sites-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  project: Project;
  site: Site;
  error: number;
  errorCodes = this.sitesApi.apiReturnCodes;

  constructor(
    private route: ActivatedRoute,
    private sitesApi: SitesService,
    private projectsApi: ProjectsService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: params => {
        this.projectsApi.getProject(params.projectId).subscribe({
          next: project => {
            this.project = project;
            this.error = null;
          },
          error: (err: APIError) => {
            this.error = err.code;
          }
        });

        this.sitesApi
          .getProjectSite(params.projectId, params.siteId)
          .subscribe({
            next: site => {
              this.site = site;
            },
            error: (err: APIError) => {
              this.error = err.code;
            }
          });
      }
    });
  }
}
