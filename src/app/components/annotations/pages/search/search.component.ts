import { Component, Injector, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Verification } from "@models/Verification";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Router } from "@angular/router";
import { VerificationService } from "@baw-api/verification/verification.service";
import { Filters, Paging } from "@baw-api/baw-api.service";
import { takeUntil } from "rxjs";
import { StrongRoute } from "@interfaces/strongRoute";
import { regionResolvers } from "@baw-api/region/regions.service";
import { Location } from "@angular/common";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-annotations-search",
  templateUrl: "search.component.html",
  styleUrl: "search.component.scss",
})
class AnnotationSearchComponent extends PageComponent implements OnInit {
  public constructor(
    protected verificationApi: VerificationService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private injector: Injector
  ) {
    super();
  }

  public paginationInfo: Paging;
  protected searchResults: Verification[] = Array.from({ length: 15 });
  protected searchParameters: AnnotationSearchParameters;
  protected verificationRoute: StrongRoute;
  protected project: Project;
  protected region?: Region;
  protected site?: Site;

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.searchParameters = new AnnotationSearchParameters(
          params,
          this.injector
        );

        this.updateSearchResults();
      });

    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }

    this.verificationRoute = this.verifyAnnotationsRoute();
  }

  protected updateSearchResults(): void {
    const filterBody = this.buildFilter();

    this.verificationApi
      .filter(filterBody)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        this.searchResults = results;
      });
  }

  protected updateSearchParameters(model: AnnotationSearchParameters): void {
    this.searchParameters = model;
    this.updateSearchResults();
    this.updateUrlParameters();
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    if (this.site) {
      return this.site.isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (this.region) {
      return annotationMenuItems.verify.region.route;
    }

    return annotationMenuItems.verify.project.route;
  }

  protected downloadAnnotationsUrl(): string {
    return this.verificationApi.downloadVerificationsTableUrl(
      this.buildFilter()
    );
  }

  protected pagePreviewNext(): void {
    this.previewPage++;
  }

  protected pagePreviewPrevious(): void {
    if (this.pagedItems <= 0) {
      this.pagedItems = 0;
      return;
    }

    this.previewPage--;
  }

  private updateUrlParameters(): void {
    const queryParams = this.searchParameters.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });

    // TODO: remove this guard before review. For some reason urlTree is null during testing
    if (urlTree) {
      this.location.replaceState(urlTree.toString());
    }
  }

  private buildFilter(): Filters<Verification> {
    const filter: Filters<Verification> = this.searchParameters.toFilter();
    const paging: Paging = {
      page: this.previewPage,
      items: this.previewSize,
    };

    filter.paging = paging;
    return filter;
  }
}

function getPageInfo(
  subRoute: keyof typeof annotationMenuItems.search
): IPageInfo {
  return {
    pageRoute: annotationMenuItems.search[subRoute],
    category: annotationMenuItems.search[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AnnotationSearchComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { AnnotationSearchComponent };
