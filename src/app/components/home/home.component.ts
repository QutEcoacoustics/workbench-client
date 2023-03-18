import { Component, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { CMS } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { Brand } from "@helpers/app-initializer/app-initializer";
import { PageComponent } from "@helpers/page/pageComponent";
import { StrongRoute } from "@interfaces/strongRoute";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { homeCategory, homeMenuItem } from "./home.menus";

@Component({
  selector: "baw-home",
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html",
})
class HomeComponent extends PageComponent implements OnInit {
  public brand: Brand;
  public page = CMS.home;
  public svg: {
    width: string;
    height: string;
    viewBox: string;
    title: string[];
    alt: string;
  };
  public viewMoreLink: { label: string; link: StrongRoute };
  public models$: Observable<List<Project | Region>>;
  public allSites$: Observable<List<Project | Region>>;
  public sourceRepo: string;

  public constructor(
    private regionApi: ShallowRegionsService,
    private projectApi: ProjectsService,
    public config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    const settings = this.config.settings;
    this.brand = settings.brand;
    this.sourceRepo = settings.links.sourceRepository;
    this.viewMoreLink = {
      label: settings.hideProjects ? "site" : "project",
      link: settings.hideProjects
        ? shallowRegionsMenuItem.route
        : projectsMenuItem.route,
    };
    this.svg = {
      width: "80%",
      height: this.calculateTitleHeight(this.brand.long),
      viewBox: this.calculateViewBox(this.brand.long),
      title: this.brand.long.split(" "),
      alt: this.brand.long,
    };

    /**
     * TODO Sort models using the following format:
     * sorted by:
     *  permission level high to low
     *  recent use / modification date (recent, to less recent)
     *  image or no image
     */

    const filter: Filters<Region | Project> = {
      paging: { items: 3 },
      sorting: { orderBy: "updatedAt", direction: "desc" },
    };
    const models$: Observable<Region[] | Project[]> = settings.hideProjects
      ? this.regionApi.filter(filter)
      : this.projectApi.filter(filter);

    this.models$ = models$.pipe(
      map((models) => List<Project | Region>(models)),
      takeUntil(this.unsubscribe)
    );

    // to render the "live site map" at the bottom of the home page, the home component has to have knowledge of all the site locations
    this.fetchAllSiteLocations();
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

  /**
   * The home component must have knowledge on all site locations for the overview map
   */
  public fetchAllSiteLocations(): Observable<List<Project | Region>> {
    const settings = this.config.settings;

    let pageNumber = 1;
    // Get the first page of points. This will also provide information on the max page length to search through
    let maxPageNumber = 1;

    while (pageNumber <= maxPageNumber) {
      const filter = { paging: { page: pageNumber } };

      const sites: Observable<Region[] | Project[]> = settings.hideProjects
        ? this.regionApi.filter(filter)
        : this.projectApi.filter(filter);

      this.allSites$ = sites.pipe(
        map((models) => List<Project | Region>(models)),
        takeUntil(this.unsubscribe)
      );

      // find the max page number from the metadata
      this.allSites$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((site) => maxPageNumber = site.toArray()?.shift()?.getMetadata()?.paging?.maxPage);
      pageNumber++;
    }

    return this.allSites$;
  }

  public projects(sites: List<Project | Region>): List<Project> {
    return sites?.filter((location) => location.kind === "Project") as List<Project>;
  }

  public regions(sites: List<Project | Region>): List<Region> {
    return sites?.filter((location) => location.kind === "Region") as List<Region>;
  }
}

HomeComponent.linkToRoute({
  category: homeCategory,
  pageRoute: homeMenuItem,
  fullscreen: true,
});

export { HomeComponent };
