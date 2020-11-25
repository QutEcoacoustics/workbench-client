import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myProjectsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-projects",
  templateUrl: "./projects.component.html",
})
class MyProjectsComponent extends PagedTableTemplate<TableRow, Project> {
  protected api: ProjectsService;
  public columns = [
    { name: "Project" },
    { name: "Sites" },
    { name: "Permission" },
  ];
  public sortKeys = { project: "name" };

  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (projects) =>
        projects.map((project) => ({
          project,
          sites: project.siteIds.size,
          permission: project.accessLevel,
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }
}

MyProjectsComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myProjectsMenuItem);

export { MyProjectsComponent };

interface TableRow {
  project: Project;
  sites: number;
  permission: string;
}
