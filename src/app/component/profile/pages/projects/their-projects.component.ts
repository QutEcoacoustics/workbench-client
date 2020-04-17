import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account.service";
import { ProjectsService } from "@baw-api/projects.service";
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirProjectsMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileMenuItemActions } from "../profile/their-profile.component";

const accountKey = "account";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      theirProfileMenuItem,
      ...theirProfileMenuItemActions,
    ]),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirProjectsMenuItem,
})
@Component({
  selector: "app-their-account-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class TheirProjectsComponent extends PagedTableTemplate<
  TableRow,
  Project
> {
  public columns = [
    { name: "Project" },
    { name: "Sites" },
    { name: "Permission" },
  ];

  // TODO Utilize https://github.com/QutEcoacoustics/baw-server/issues/438 service
  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (projects) =>
        projects.map((project) => ({
          project: {
            label: project.name,
            route: project.navigationPath(),
          },
          sites: project.siteIds.size,
          permission: "FIX ME",
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
  project: {
    label: string;
    route: string;
  };
  sites: number;
  permission: string;
}
