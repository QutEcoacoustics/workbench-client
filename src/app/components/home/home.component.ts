import { Component, OnInit } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";
import { map, mergeMap, takeUntil } from "rxjs/operators";
import { homeCategory, homeMenuItem } from "./home.menus";

@Component({
  selector: "baw-home",
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html",
})
class HomeComponent extends PageComponent implements OnInit {
  public page = CMS.home;
  public projectsLink = projectsMenuItem.route.toString();
  public projectList: List<Card> = List([]);

  public constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  public ngOnInit() {
    this.securityApi
      .getAuthTrigger()
      .pipe(
        mergeMap(() => this.projectApi.filter({ paging: { items: 3 } })),
        map((data) => List(data.map((project) => project.getCard()))),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards) => (this.projectList = cards),
        () => (this.projectList = List([]))
      );
  }
}

HomeComponent.LinkComponentToPageInfo({
  category: homeCategory,
  fullscreen: true,
}).AndMenuRoute(homeMenuItem);

export { HomeComponent };
