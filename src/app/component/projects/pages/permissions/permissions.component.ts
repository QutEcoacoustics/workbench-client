import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { theirProfileMenuItem } from "src/app/component/profile/profile.menus";
import { ISelectableItem } from "src/app/component/shared/items/selectable-items/selectable-items.component";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ListTemplate } from "src/app/helpers/tableTemplate/tableTemplate";
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
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: editProjectPermissionsMenuItem
})
@Component({
  selector: "app-project-permissions",
  templateUrl: "permissions.component.html",
  styleUrls: ["permissions.component.scss"]
})
export class PermissionsComponent extends ListTemplate<TableRow>
  implements OnInit, OnDestroy {
  public errorDetails: APIErrorDetails;
  public loading: boolean;
  public project: Project;
  public ready: boolean;
  public userIcon: IconProp = theirProfileMenuItem.icon;
  public users: User[];

  public individualOptions: ISelectableItem[];
  public userOptions: ISelectableItem[];
  public visitorOptions: ISelectableItem[];

  private unsubscribe = new Subject();

  constructor(private route: ActivatedRoute, private api: ProjectsService) {
    super((val, row) => this.checkMatch(val, row.user));
  }

  ngOnInit() {
    this.ready = false;

    this.columns = [
      { name: "User" },
      { name: "Individual" },
      { name: "Visitors" },
      { name: "Users" },
      { name: "Overall" }
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

    this.individualOptions = [
      { label: "None", value: "none" },
      { label: "Reader", value: "reader" },
      { label: "Writer", value: "writer" },
      { label: "Owner", value: "owner" }
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

    this.loadTable();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  public submit($event: any) {
    console.log($event);
  }

  protected createRows() {
    this.rows = [
      {
        user: "allcharles",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader"
      },
      {
        user: "anthony",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader"
      },
      {
        user: "phil",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader"
      }
    ];
  }
}

interface TableRow {
  user: string;
  individual: string;
  visitors: "None" | "Reader";
  users: "None" | "Reader" | "Writer" | "Owner";
  overall: "None" | "Reader" | "Writer" | "Owner";
}
