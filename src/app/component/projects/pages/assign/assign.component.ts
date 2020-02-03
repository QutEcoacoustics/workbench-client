import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: assignSiteMenuItem
})
@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"]
})
export class AssignComponent extends PageComponent
  implements OnInit, OnDestroy {
  // TODO Move this back into the admin dashboard

  public ready: boolean;
  public error: APIErrorDetails;
  public project: Project;
  public sites: Site[];
  public columns = [
    { name: "Site Id" },
    { name: "Name" },
    { name: "Description" }
  ];
  public rows: { siteId: number; name: string; description: string }[] = [];

  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  private unsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService
  ) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.getProject(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        project => {
          this.project = project;

          this.rows = [
            {
              siteId: -1,
              name: "Name",
              description: null
            },
            {
              siteId: -1,
              name: "Name",
              description: "Custom description"
            }
          ];

          this.ready = true;
        },
        (err: APIErrorDetails) => {}
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
