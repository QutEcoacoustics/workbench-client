import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { theirProfileMenuItem } from "@components/profile/profile.menus";
import {
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { TableTemplate } from "@helpers/tableTemplate/tableTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { ISelectableItem } from "@shared/items/selectable-items/selectable-items.component";
import { List } from "immutable";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Component({
  selector: "baw-project-permissions",
  templateUrl: "permissions.component.html",
  styleUrls: ["permissions.component.scss"],
})
class PermissionsComponent extends TableTemplate<TableRow> implements OnInit {
  public project: Project;
  public userIcon: IconProp = theirProfileMenuItem.icon;
  public users: User[];

  public individualOptions: ISelectableItem[];
  public userOptions: ISelectableItem[];
  public visitorOptions: ISelectableItem[];

  public constructor(
    private route: ActivatedRoute,
    private api: ProjectsService
  ) {
    super((val, row) => this.checkMatch(val, row.user));
  }

  public ngOnInit() {
    this.columns = [
      { name: "User" },
      { name: "Individual" },
      { name: "Visitors" },
      { name: "Users" },
      { name: "Overall" },
    ];

    this.visitorOptions = [
      { label: "No access (none)", value: "none" },
      { label: "Reader access", value: "reader" },
    ];

    this.userOptions = [
      { label: "No access (none)", value: "none" },
      { label: "Reader access", value: "reader" },
      { label: "Writer access", value: "writer" },
    ];

    this.individualOptions = [
      { label: "None", value: "none" },
      { label: "Reader", value: "reader" },
      { label: "Writer", value: "writer" },
      { label: "Owner", value: "owner" },
    ];

    const projectModel: ResolvedModel<Project> =
      this.route.snapshot.data[projectKey];

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.loadTable();
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
        overall: "Reader",
      },
      {
        user: "anthony",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader",
      },
      {
        user: "phil",
        individual: "testing",
        visitors: "Reader",
        users: "Reader",
        overall: "Reader",
      },
    ];
  }
}

PermissionsComponent.linkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent)],
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).andMenuRoute(editProjectPermissionsMenuItem);

export { PermissionsComponent };

interface TableRow {
  user: string;
  individual: string;
  visitors: "None" | "Reader";
  users: "None" | "Reader" | "Writer" | "Owner";
  overall: "None" | "Reader" | "Writer" | "Owner";
}
