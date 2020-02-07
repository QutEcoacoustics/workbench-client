import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  assignSiteMenuItem,
  newSiteMenuItem
} from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  exploreAudioProjectMenuItem,
  projectMenuItem,
  projectsCategory
} from "../../projects.menus";

export const projectMenuItemActions = [
  exploreAudioProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem
];

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>(projectMenuItemActions),
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
export class DetailsComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  project: Project;
  sites: Site[];
  error: ApiErrorDetails;
  state = "loading";

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
  ) {
    super();
  }

  ngOnInit() {
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
          this.state = "ready";
        },
        (err: ApiErrorDetails) => {
          this.error = err;
          this.state = "error";
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
            this.state = "error";
          }
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
