import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { IPageInfo } from "@helpers/page/pageInfo";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Params } from "@angular/router";
import { Paging } from "@baw-api/baw-api.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { regionResolvers } from "@baw-api/region/regions.service";
import { FiltersWarningModalComponent } from "@components/annotations/components/modals/filters-warning/filters-warning.component";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { Annotation } from "@models/data/Annotation";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { firstValueFrom } from "rxjs";
import { Region } from "@models/Region";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { IfLoggedInComponent } from "@shared/can/can.component";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { RenderMode } from "@angular/ssr";
import {
  annotationSearchParametersResolvers,
} from "@components/annotations/components/annotation-search-form/annotation-search-parameters.resolver";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { verificationParametersResolvers } from "@components/annotations/components/verification-form/verification-parameters.resolver";
import { VerificationParameters } from "@components/annotations/components/verification-form/verificationParameters";
import {
  VerificationFiltersModalComponent,
} from "@components/annotations/components/modals/verification-filters/verification-filters.component";
import { mergeParameters } from "@helpers/parameters/merge";
import { filterAnd } from "@helpers/filters/filters";
import { AnnotationSearchFormComponent } from "../../components/annotation-search-form/annotation-search-form.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const searchParametersKey = "searchParameters";
const verificationParametersKey = "verificationParameters";

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
    VerificationFiltersModalComponent,
    LoadingComponent,
  ],
})
class AnnotationSearchComponent
  extends PaginationTemplate<AudioEvent>
  implements OnInit
{
  protected readonly modals = inject(NgbModal);
  private readonly injector: AssociationInjector = inject(ASSOCIATION_INJECTOR);
  private readonly audioEventApi = inject(ShallowAudioEventsService);

  public constructor() {
    const audioEventApi = inject(ShallowAudioEventsService);
    const annotationService = inject(AnnotationService);

    super(
      audioEventApi,
      "id",
      () => [],
      async (newResults: AudioEvent[]) => {
        this.loading = true;

        const results = await Promise.all(
          newResults.map(
            async (result) =>
              await annotationService.show(
                result,
                this.verificationParameters().tagPriority(
                  this.searchParameters().tags ?? [],
                ),
              ),
          ),
        );

        this.searchResults.set(results);

        if (newResults.length === 0) {
          this.paginationInformation.set({ total: 0, items: 0, page: 1 });
        } else {
          this.paginationInformation.set(newResults[0].getMetadata().paging);
        }

        this.loading = false;
      },
      () => this.searchParameters().toFilter().filter,
      () => this.searchParameters().toFilter().sorting,
    );

    // we make the page size an even number so that the page of results is more
    // likely to fit on the screen in a nice way
    this.pageSize = 24;
  }

  public readonly broadFilterWarningModal = viewChild<
    ElementRef<FiltersWarningModalComponent>
  >("broadSearchWarningModal");

  public readonly verificationFiltersModal = viewChild<
    ElementRef<VerificationFiltersModalComponent>
  >("verificationFiltersModal");

  public readonly searchParameters = signal<AnnotationSearchParameters | null>(
    null,
  );
  public readonly verificationParameters =
    signal<VerificationParameters | null>(null);

  public readonly searchResults = signal<Annotation[]>([]);
  public readonly paginationInformation = signal<Paging>({});

  // This is not a signal because it does not need to be reactive.
  private verificationRoute: StrongRoute;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    this.searchParameters.update(() => {
      const newModel = models[
        searchParametersKey
      ] as AnnotationSearchParameters;

      newModel.injector = this.injector;

      newModel.routeProjectModel = models[projectKey] as Project;

      if (models[regionKey]) {
        newModel.routeRegionModel = models[regionKey] as Region;
      }

      if (models[siteKey]) {
        newModel.routeSiteModel = models[siteKey] as Site;
      }

      return newModel;
    });

    this.verificationParameters.update(() => {
      const newModel = models[
        verificationParametersKey
      ] as VerificationParameters;

      newModel.injector = this.injector;

      return newModel;
    });

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
    const queryParams: Params = this.searchParameters().toQueryParams();

    // we have this condition so that undefined page numbers and
    // the first (default) page number is not shown in the query parameters
    if (page && page !== 1) {
      queryParams.page = page;
    }

    this.router.navigate([], { queryParams });
  }

  protected updateSearchParameters(model: AnnotationSearchParameters): void {
    this.searchParameters.set(model);
    this.updateQueryParams(this.page);
    this.updateFromUrl();
  }

  protected async createVerificationTask(): Promise<void> {
    const modalRef = this.modals.open(this.verificationFiltersModal(), {
      size: "lg",
    });
    const result = await modalRef.result.catch((_) => false);

    if (!result) {
      // I purposely include a log here so that if we ever encounter a bug in
      // production where a verification task cannot be created, we have a log
      // to indicate that the user cancelled the operation.
      // eslint-disable-next-line no-console
      console.debug("User cancelled verification task creation");
      return;
    }

    this.verificationParameters.set(result);
  }

  protected async navigateToVerificationGrid(): Promise<void> {
    const queryParams = mergeParameters(
      this.searchParameters().toQueryParams(),
      this.verificationParameters().toQueryParams(),
    );

    const numberOfParameters = Object.keys(queryParams).length;

    // if the user has not added any search filters, we want to confirm that the
    // user wanted to create a verification task over all annotations in the
    // project, region or site
    if (numberOfParameters === 0) {
      const verificationFilters = this.verificationParameters().toFilter();
      const searchFilters = this.searchParameters().toFilter({
        includeVerification: false,
      });

      const filter = filterAnd<AudioEvent>(
        verificationFilters.filter,
        searchFilters.filter,
      );

      // if the verification task has less than 1,000 annotations, we don't need
      // to show an error modal
      const request = this.audioEventApi.filter({
        filter: filter,
        paging: { items: 1 },
      });

      const response = await firstValueFrom(request);
      if (response.length === 0) {
        // We usually get the total number of items from the first return items
        // response metadata.
        // However, if there are no items, we cannot index into the first item.
        // To prevent throwing an error, we do an early return.
        return;
      }

      const itemWarningThreshold = 1_000;
      const responseMetadata = response[0].getMetadata();
      const numberOfItems = responseMetadata.paging.total;

      if (numberOfItems > itemWarningThreshold) {
        const warningModal = this.modals.open(this.broadFilterWarningModal());
        const success = await warningModal.result.catch((_) => false);

        // the user doesn't want to continue with the search
        // we return early to prevent router navigation
        if (!success) {
          return;
        }
      }
    }

    const searchParameters = this.searchParameters();
    this.router.navigate(
      [
        this.verificationRoute.toRouterLink({
          projectId: searchParameters.routeProjectId,
          regionId: searchParameters.routeRegionId,
          siteId: searchParameters.routeSiteId,
        }),
      ],
      { queryParams },
    );
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    const searchParameters = this.searchParameters();

    if (searchParameters.routeSiteId) {
      return searchParameters.routeSiteModel.isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (searchParameters.routeRegionId) {
      return annotationMenuItems.verify.region.route;
    }

    return annotationMenuItems.verify.project.route;
  }
}

function getPageInfo(
  subRoute: keyof typeof annotationMenuItems.search,
): IPageInfo {
  return {
    pageRoute: annotationMenuItems.search[subRoute],
    category: annotationMenuItems.search[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [searchParametersKey]: annotationSearchParametersResolvers.showOptional,
      [verificationParametersKey]: verificationParametersResolvers.showOptional,
    },
    // We use client rendering because:
    // 1. We are rendering spectrograms, and we should not be trying to render
    //    spectrograms on the server.
    // 2. The most used selection technique is to only show annotations that the
    //    current user has not verified.
    //    During SSR we do not know who the current user is, so we would have
    //    to double fetch the list of audio events (once unauthenticated and
    //    once when the user authenticates).
    //    To prevent making redundant requests, we do not server render the
    //    search page, and only start rendering on the client where the user is
    //    authenticated.
    renderMode: RenderMode.Client,
  };
}

AnnotationSearchComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { AnnotationSearchComponent };
