import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, map, takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { projectsMenuItem } from "../projects/projects.menus";
import { Card } from "../shared/cards/cards.component";
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
export class HomeComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  moreProjectsLink = projectsMenuItem;
  projectList: List<Card> = List([]);

  constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  ngOnInit() {
    this.securityApi
      .getLoggedInTrigger()
      .pipe(
        flatMap(() => {
          return this.projectApi.getFilteredProjects({ items: 3 });
        }),
        map((data: Project[]) => {
          return List(data.map(project => project.card));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards: List<Card>) => {
          console.log("Cards: ", cards);
          this.projectList = cards;
        },
        (err: APIErrorDetails) => {
          this.projectList = List([]);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
