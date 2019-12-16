import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  exploreAudioMenuItem,
  projectMenuItem,
  projectsCategory
} from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      exploreAudioMenuItem,
      editProjectMenuItem,
      editProjectPermissionsMenuItem,
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
export class DetailsComponent extends PageComponent
  implements OnInit, OnDestroy {
  project: Project;
  sites: Site[];
  status: number;
  state = "loading";
  subSink: SubSink = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
  ) {
    super();
  }

  ngOnInit() {
    // Retrieve project details
    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.getProject(params.projectId);
        })
      )
      .subscribe(
        project => {
          this.project = project;
          this.state = "ready";
        },
        (err: APIErrorDetails) => {
          this.status = err.status;
          this.state = "error";
        }
      );

    // Retrieve site details
    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.getProjectSites(params.projectId);
        })
      )
      .subscribe(
        sites => (this.sites = sites),
        (err: APIErrorDetails) => {
          if (this.state !== "error") {
            this.status = err.status;
            this.state = "error";
          }
        }
      );
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
