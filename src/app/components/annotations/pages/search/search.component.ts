import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { IPageInfo } from "@helpers/page/pageInfo";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Paging } from "@baw-api/baw-api.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { regionResolvers } from "@baw-api/region/regions.service";
import { FiltersWarningModalComponent } from "@components/annotations/components/modals/filters-warning/filters-warning.component";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import {
  NgbModal,
  NgbPaginationConfig,
  NgbPagination,
} from "@ng-bootstrap/ng-bootstrap";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { Annotation } from "@models/data/Annotation";
import {
  annotationResolvers,
  AnnotationService,
} from "@services/models/annotation.service";
import { firstValueFrom } from "rxjs";
import { Region } from "@models/Region";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { IfLoggedInComponent } from "@shared/can/can.component";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { AnnotationSearchFormComponent } from "../../components/annotation-search-form/annotation-search-form.component";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const annotationsKey = "annotations";

@Component({
  selector: "baw-annotations-search",
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
  imports: [
    AnnotationSearchFormComponent,
    IfLoggedInComponent,
    AnnotationEventCardComponent,
    NgbPagination,
    ErrorHandlerComponent,
    FiltersWarningModalComponent,
  ],
})
class AnnotationSearchComponent
  extends PaginationTemplate<AudioEvent>
  implements OnInit
{
  public constructor(
    protected audioEventApi: ShallowAudioEventsService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected config: NgbPaginationConfig,
    protected modals: NgbModal,
    protected annotationService: AnnotationService,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector
  ) {
    super(
      router,
      route,
      config,
      audioEventApi,
      "id",
      () => [],
      async (newResults: AudioEvent[]) => {
        this.loading = true;
        this.searchResults = await Promise.all(
          newResults.map(async (result) => await annotationService.show(result))
        );

        if (newResults.length > 0) {
          this.paginationInformation = newResults[0].getMetadata().paging;
        }
        this.loading = false;
      },
      () => this.searchParameters.toFilter().filter,
      () => this.searchParameters.toFilter().sorting,
    );

    // we make the page size an even number so that the page of results is more
    // likely to fit on the screen in a nice way
    this.pageSize = 24;
  }

  @ViewChild("broadSearchWarningModal")
  public broadFilterWarningModal: ElementRef<FiltersWarningModalComponent>;

  public searchParameters: AnnotationSearchParameters;
  protected paginationInformation: Paging;
  public searchResults: Annotation[] = [];
  protected verificationRoute: StrongRoute;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.searchParameters ??= models[
      annotationsKey
    ] as AnnotationSearchParameters;
    this.searchParameters.injector = this.injector;

    this.searchParameters.routeProjectModel ??= models[projectKey] as Project;
    if (models[regionKey]) {
      this.searchParameters.routeRegionModel ??= models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.searchParameters.routeSiteModel ??= models[siteKey] as Site;
    }

    this.verificationRoute = this.verifyAnnotationsRoute();

    // calling the pagination templates ngOnInit() method causes the first page
    // of results to be fetched and displayed
    super.ngOnInit();
  }

  // the PaginationTemplate that we extend only supports a single filter
  // query string parameter e.g. a projects name
  // since we have multiple conditions, I have overridden the updateQueryParams
  // method
  //
  // TODO: the correct fix here would be to add support for any length query
  // string parameters to the pagination template
  protected override updateQueryParams(page: number): void {
    const queryParams: Params = this.searchParameters.toQueryParams();

    // we have this condition so that undefined page numbers and
    // the first (default) page number is not shown in the query parameters
    if (page && page !== 1) {
      queryParams.page = page;
    }

    this.router.navigate([], { relativeTo: this.route, queryParams });
  }

  protected updateSearchParameters(model: AnnotationSearchParameters): void {
    this.searchParameters = model;
    this.updateQueryParams(this.page);
  }

  protected async navigateToVerificationGrid(): Promise<void> {
    const queryParameters = this.searchParameters.toQueryParams();
    const numberOfParameters = Object.keys(queryParameters).length;

    // if the user has not added any search filters, we want to confirm that the
    // user wanted to create a verification task over all annotations in the
    // project, region or site
    if (numberOfParameters === 0) {
      // if the verification task has less than 1,000 annotations, we don't need
      // to show an error modal
      const request = this.audioEventApi.filter({
        filter: this.searchParameters.toFilter().filter,
        paging: { items: 1 },
      });

      const response = await firstValueFrom(request);

      const itemWarningThreshold = 1_000;
      const responseMetadata = response[0].getMetadata();
      const numberOfItems = responseMetadata.paging.total;

      if (numberOfItems > itemWarningThreshold) {
        const warningModal = this.modals.open(this.broadFilterWarningModal);
        const success = await warningModal.result.catch((_) => false);

        // the user doesn't want to continue with the search
        // we return early to prevent router navigation
        if (!success) {
          return;
        }
      }
    }

    const queryParams = this.searchParameters.toQueryParams();

    this.router.navigate(
      [
        this.verificationRoute.toRouterLink({
          projectId: this.searchParameters.routeProjectId,
          regionId: this.searchParameters.routeRegionId,
          siteId: this.searchParameters.routeSiteId,
        }),
      ],
      { queryParams }
    );
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    if (this.searchParameters.routeSiteId) {
      return this.searchParameters.routeSiteModel.isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (this.searchParameters.routeRegionId) {
      return annotationMenuItems.verify.region.route;
    }

    return annotationMenuItems.verify.project.route;
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
      [annotationsKey]: annotationResolvers.showOptional,
    },
  };
}

AnnotationSearchComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { AnnotationSearchComponent };
