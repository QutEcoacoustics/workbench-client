import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "@baw-api/projects.service";
import { userResolvers } from "@baw-api/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myProjectsMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountMenuItemActions } from "../profile/my-profile.component";

const accountKey = "account";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      myAccountMenuItem,
      ...myAccountMenuItemActions,
    ]),
    links: List(),
  },
  resolvers: {
    [accountKey]: userResolvers.show,
  },
  self: myProjectsMenuItem,
})
@Component({
  selector: "app-my-account-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class MyProjectsComponent extends PagedTableTemplate<TableRow, Project> {
  public columns = [
    { name: "Name" },
    { name: "Sites" },
    { name: "Permission" },
  ];

  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (projects) =>
        projects.map((project) => ({
          name: {
            label: project.name,
            route: project.redirectPath(),
          },
          sites: project.siteIds.size,
          permission: "UNKNOWN", // TODO After https://github.com/QutEcoacoustics/baw-server/issues/425
        })),
      route
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }
}

interface TableRow {
  // name: Project
  name: {
    label: string;
    route: string;
  };
  sites: number;
  permission: string;
}
