import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
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
    actions: List<AnyMenuItem>([editProjectMenuItem, newSiteMenuItem]),
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
  error: number;
  errorCodes = this.sitesApi.apiReturnCodes;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
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

        this.sitesApi.getProjectSites(params.projectId).subscribe({
          next: sites => {
            this.sites = sites;
          }
        });
      }
    });
  }
}
