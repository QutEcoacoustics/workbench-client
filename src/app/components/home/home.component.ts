import { Component, OnInit } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { ConfigService } from "@services/config/config.service";
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
  public projectList: List<Card> = List([]);
  public projectsLink = projectsMenuItem.route;
  public title: string;
  public viewBox: string;

  public constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService,
    public config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    this.title = this.config.settings.brand.short.toLocaleUpperCase();
    this.viewBox = this.calculateViewBox(this.title);

    /**
     * TODO Sort projects using the following format:
     * sorted by:
     *  permission level high to low
     *  recent use / modification date (recent, to less recent)
     *  image or no image
     */
    this.securityApi
      .getAuthTrigger()
      .pipe(
        mergeMap(() =>
          this.projectApi.filter({
            paging: { items: 3 },
            sorting: { orderBy: "updatedAt", direction: "desc" },
          })
        ),
        map((data) => List(data.map((project) => project.getCard()))),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards) => (this.projectList = cards),
        () => (this.projectList = List([]))
      );
  }

  private calculateViewBox(title: string) {
    const xPos = 0;
    const yPos = 0;
    const height = 17;

    // 15 characters equal a width of 157, works out to be a decent ratio
    const charToWidthRatio = 157 / 15;
    const minWidth = 70;
    const width = Math.max(
      minWidth,
      Math.floor(title.length * charToWidthRatio)
    );

    return `${xPos} ${yPos} ${width} ${height}`;
  }
}

HomeComponent.linkComponentToPageInfo({
  category: homeCategory,
  fullscreen: true,
}).andMenuRoute(homeMenuItem);

export { HomeComponent };
