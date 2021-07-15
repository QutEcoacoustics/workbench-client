import { Component, OnInit } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { Brand } from "@helpers/app-initializer/app-initializer";
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
  public brand: Brand;
  public page = CMS.home;
  public projectList: List<Card> = List([]);
  public projectsLink = projectsMenuItem.route;
  public viewBox: string;
  public svg: {
    width: string;
    height: string;
    viewBox: string;
    title: string[];
    alt: string;
  };
  public sourceRepo: string;

  public constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService,
    public config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    this.brand = this.config.settings.brand;
    this.sourceRepo = this.config.settings.links.sourceRepository;

    this.svg = {
      width: "80%",
      height: this.calculateTitleHeight(this.brand.long),
      viewBox: this.calculateViewBox(this.brand.long),
      title: this.brand.long.split(" "),
      alt: this.brand.long,
    };

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

  public calculateSvgTextYPos(index: number) {
    const minOffset = 10;
    const offsetPerRow = 18; //18px
    return minOffset + index * offsetPerRow + "px";
  }

  private calculateTitleHeight(title: string) {
    const wordCount = title.split(" ").length;
    const heightPerRow = 180; //180px
    return heightPerRow * wordCount + "px";
  }

  private calculateViewBox(title: string) {
    const xPos = 0;
    const yPos = 0;

    const words = title.split(" ");
    const wordCount = words.length;
    const longestWord = Math.max(...words.map((word) => word.length));

    const heightPadding = 0;
    const heightPerRow = 18;
    const height = heightPerRow * wordCount + heightPadding;

    // Handle words which exceed 14 characters
    const charToWidthRatio = 12;
    const minWidth = 150;
    const width = Math.max(
      minWidth,
      Math.floor(longestWord * charToWidthRatio)
    );

    return `${xPos} ${yPos} ${width} ${height}`;
  }
}

HomeComponent.linkComponentToPageInfo({
  category: homeCategory,
  fullscreen: true,
}).andMenuRoute(homeMenuItem);

export { HomeComponent };
