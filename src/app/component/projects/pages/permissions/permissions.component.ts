import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { ISelectableItem } from "src/app/component/shared/items/selectable-items/selectable-items.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    links: List()
  },
  self: editProjectPermissionsMenuItem
})
@Component({
  selector: "app-project-permissions",
  templateUrl: "permissions.component.html"
})
export class PermissionsComponent extends PageComponent
  implements OnInit, OnDestroy {
  public errorDetails: APIErrorDetails;
  public loading: boolean;
  public ready: boolean;
  public project: Project;
  public visitorOptions: ISelectableItem[];
  public userOptions: ISelectableItem[];
  public users: User[];
  public columns = [
    { name: "User" },
    { name: "Individual" },
    { name: "Visitors" },
    { name: "Users" },
    { name: "Overall" }
  ];
  public rows: {
    user: string;
    individual: string;
    visitors: "None" | "Reader" | "Owner";
    users: "None" | "Reader" | "Owner";
    overall: "None" | "Reader" | "Owner";
  }[];
  private unsubscribe = new Subject();

  constructor(private route: ActivatedRoute, private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    this.rows = [
      {
        user: "allcharles",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader"
      }
    ];

    this.visitorOptions = [
      { label: "No access (none)", value: "none" },
      { label: "Reader access", value: "reader" }
    ];

    this.userOptions = [
      { label: "No access (none)", value: "none" },
      { label: "Reader access", value: "reader" },
      { label: "Writer access", value: "writer" }
    ];

    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getProject(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        project => {
          // Do something
          this.project = project;
          this.ready = true;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  submit($event: any) {
    console.log($event);
  }
}
