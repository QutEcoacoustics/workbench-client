import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Verification } from "@models/Verification";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Router } from "@angular/router";
import { VerificationService } from "@baw-api/verification/verification.service";
import { Paging } from "@baw-api/baw-api.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { regionResolvers } from "@baw-api/region/regions.service";
import { FiltersWarningModalComponent } from "@components/annotations/components/broad-filters-warning/broad-filters-warning.component";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { NgbModal, NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-annotations-search",
  templateUrl: "search.component.html",
  styleUrl: "search.component.scss",
})
class AnnotationSearchComponent
  extends PaginationTemplate<Verification>
  implements OnInit
{
  public constructor(
    protected verificationApi: VerificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected config: NgbPaginationConfig,
    protected modals: NgbModal,
    private injector: Injector
  ) {
    super(
      router,
      route,
      config,
      verificationApi,
      "id",
      () => [],
      (newResults: Verification[]) => {
        this.searchResults = newResults;

        if (newResults.length > 0) {
          this.paginationInformation = newResults[0].getMetadata().paging;
        }
      },
      () => this.searchParameters.toFilter().filter
    );

    // we make the page size an even number so that the page of results is more
    // likely to fit on the screen in a nice way
    this.pageSize = 24;
  }

  @ViewChild("broadSearchWarningModal")
  public broadFilterWarningModal: ElementRef<FiltersWarningModalComponent>;

  protected paginationInformation: Paging;
  protected searchResults: Verification[] = [];
  protected searchParameters: AnnotationSearchParameters;
  protected verificationRoute: StrongRoute;
  protected project: Project;
  protected region?: Region;
  protected site?: Site;

  public ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.searchParameters = new AnnotationSearchParameters(
      params,
      this.injector
    );

    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }

    this.verificationRoute = this.verifyAnnotationsRoute();

    super.ngOnInit();
  }

  protected async navigateToVerificationGrid(): Promise<void> {
    const queryParameters = this.searchParameters.toQueryParams();
    const numberOfParameters = Object.keys(queryParameters).length;

    // if the user has not added any search filters, we want to confirm that the
    // user wanted to create a verification task over all annotations in the
    // project, region or site
    if (numberOfParameters === 0) {
      const warningModal = this.modals.open(this.broadFilterWarningModal);
      const success = await warningModal.result.catch((_) => false);

      // the user doesn't want to continue with the search
      // we return early to prevent router navigation
      if (!success) {
        return;
      }
    }

    const queryParams = this.searchParameters.toQueryParams();

    this.router.navigate(
      [
        this.verificationRoute.toRouterLink({
          projectId: this.project.id,
          regionId: this.region?.id,
          siteId: this.site?.id,
        }),
      ],
      { queryParams }
    );
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
      this.searchParameters.toFilter()
    );
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
