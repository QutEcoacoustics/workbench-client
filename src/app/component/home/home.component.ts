import { Component } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { projectsMenuItem } from "../projects/projects.menus";
import { homeCategory, homeMenuItem } from "./home.menus";

@Page({
  category: homeCategory,
  fullscreen: true,
  menus: null,
  self: homeMenuItem
})
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends PageComponent {
  moreProjectsLink = projectsMenuItem;
  projectList$: Observable<any> = this.securityApi.getLoggedInTrigger().pipe(
    flatMap(() => {
      return this.projectApi.getFilteredProjects({ items: 3 });
    }),
    map((data: Project[]) => {
      return List(data.map(project => project.card));
    })
  );

  constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService,
    private appConfig: AppConfigService
  ) {
    super();
  }
}
