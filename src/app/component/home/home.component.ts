import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, map, takeUntil } from "rxjs/operators";
import { CMS, CMS_DATA } from "src/app/helpers/app-initializer/app-initializer";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
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
  public page: string;
  public moreProjectsLink = projectsMenuItem;
  public projectList: List<Card> = List([]);
  private unsubscribe = new Subject();

  constructor(
    @Inject(CMS_DATA) private cms: CMS,
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  ngOnInit() {
    this.page = this.cms.home;

    this.securityApi
      .getAuthTrigger()
      .pipe(
        flatMap(() => {
          return this.projectApi.filter({ paging: { items: 3 } });
        }),
        map((data: Project[]) => {
          return List(data.map(project => project.getCard()));
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
