import { Component, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/projects.service";
import { SecurityService } from "@baw-api/security.service";
import { projectsMenuItem } from "@component/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { Project } from "@models/Project";
import { AppConfigService } from "@services/app-config/app-config.service";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";
import { flatMap, map, takeUntil } from "rxjs/operators";
import { homeCategory, homeMenuItem } from "./home.menus";

@Page({
  category: homeCategory,
  fullscreen: true,
  menus: null,
  self: homeMenuItem,
})
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends PageComponent implements OnInit {
  public page: string;
  public moreProjectsLink = projectsMenuItem;
  public projectList: List<Card> = List([]);

  constructor(
    private env: AppConfigService,
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  ngOnInit() {
    this.page = this.env.values.cms.home;

    this.securityApi
      .getAuthTrigger()
      .pipe(
        flatMap(() => {
          return this.projectApi.filter({ paging: { items: 3 } });
        }),
        map((data: Project[]) => {
          console.log(data[0]);
          data[0].sites.subscribe(
            (sites) => console.log("Sites: ", sites),
            (error) => console.error("Sites: ", error),
            () => console.log("Complete Sites")
          );
          data[0].creator.subscribe(
            (creator) => console.log("Creator: ", creator),
            (error) => console.error("Creator: ", error),
            () => console.log("Complete Creator")
          );
          data[0].updater.subscribe(
            (updater) => console.log("Updater: ", updater),
            (error) => console.error("Updater: ", error),
            () => console.log("Complete Updater")
          );
          data[0].owner.subscribe(
            (owner) => console.log("Owner: ", owner),
            (error) => console.error("Owner: ", error),
            () => console.log("Complete Owner")
          );

          return List(data.map((project) => project.getCard()));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards: List<Card>) => {
          this.projectList = cards;
        },
        (err: ApiErrorDetails) => {
          this.projectList = List([]);
        }
      );
  }
}
