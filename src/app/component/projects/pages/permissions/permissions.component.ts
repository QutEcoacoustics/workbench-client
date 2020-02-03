import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { theirProfileMenuItem } from "src/app/component/profile/profile.menus";
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
  templateUrl: "permissions.component.html",
  styleUrls: ["permissions.component.scss"]
})
export class PermissionsComponent extends PageComponent
  implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  public userIcon: IconProp = theirProfileMenuItem.icon;
  public errorDetails: APIErrorDetails;
  public loading: boolean;
  public ready: boolean;
  public project: Project;
  public visitorOptions: ISelectableItem[];
  public userOptions: ISelectableItem[];
  public users: User[];
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public columns = [];
  public temp: {
    user: string;
    individual: string;
    visitors: "None" | "Reader" | "Owner";
    users: "None" | "Reader" | "Owner";
    overall: "None" | "Reader" | "Owner";
  }[];
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

    this.columns = [
      { name: "User" },
      { name: "Individual" },
      { name: "Visitors" },
      { name: "Users" },
      { name: "Overall" }
    ];
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
    this.temp = [...this.rows];

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

  public updateFilter($event): void {
    const val = $event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(d => {
      return d.user.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  public submit($event: any) {
    console.log($event);
  }
}
