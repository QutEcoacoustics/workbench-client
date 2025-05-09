import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myProjectsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TitleCasePipe } from "@angular/common";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-projects",
  templateUrl: "./projects.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    UrlDirective,
    ErrorHandlerComponent,
    TitleCasePipe,
  ],
})
class MyProjectsComponent extends PagedTableTemplate<TableRow, Project> {
  protected api: ProjectsService;
  public columns = [
    { name: "Project" },
    { name: "Sites" },
    { name: "Permission" },
  ];
  public sortKeys = { project: "name" };

  public constructor(api: ProjectsService, route: ActivatedRoute) {
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

MyProjectsComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: myProjectsMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MyProjectsComponent };

interface TableRow {
  project: Project;
  sites: number;
  permission: string;
}
