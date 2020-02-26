import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { exploreAudioMenuItem } from "src/app/helpers/page/externalMenus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem
];

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectMenuItemActions]),
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
  error: ApiErrorDetails;
  state = "loading";
  ready: boolean;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
  ) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    // Retrieve project details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.show(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        project => {
          this.project = project;
          this.ready = true;
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );

    // Retrieve site details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.list(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        sites => (this.sites = sites),
        (err: ApiErrorDetails) => {
          if (this.state !== "error") {
            this.error = err;
          }
        }
      );
  }
}
