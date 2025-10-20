import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { EventMapComponent } from "@shared/event-map/event-map.component";
import { AudioEvent } from "@models/AudioEvent";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Site } from "@models/Site";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { first, firstValueFrom, takeUntil } from "rxjs";
import { GroupedAudioEventsService } from "@baw-api/grouped-audio-events/grouped-audio-events.service";
import { AsyncPipe, Location, NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { EventModalComponent } from "@shared/event-modal/event-modal.component";
import { UrlDirective } from "@directives/url/url.directive";
import { Id } from "@interfaces/apiInterfaces";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { annotationSearchRoute } from "@components/annotations/annotation.routes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  annotationSearchParametersResolvers,
} from "@components/annotations/components/annotation-search-form/annotation-search-parameters.resolver";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { annotationMapParameterResolvers } from "./annotation-map-parameters.resolver";
import { AnnotationMapParameters } from "./annotationMapParameters";
import { annotationCategories, annotationMenuItems } from "@components/annotations/annotation.menu";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const searchParametersKey = "annotationMapParameters";
const annotationSearchParametersKey = "annotationSearchParameters";

@Component({
  selector: "baw-events-map-page",
  templateUrl: "./annotation-map.component.html",
  styleUrl: "./annotation-map.component.scss",
  imports: [
    EventMapComponent,
    InlineListComponent,
    SearchFiltersModalComponent,
    FaIconComponent,
    NgbTooltip,
    AsyncPipe,
    UrlDirective,
    StrongRouteDirective,
    NgTemplateOutlet,
  ],
})
class AnnotationMapPageComponent extends PageComponent implements OnInit {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly audioEventsApi = inject(ShallowAudioEventsService);
  private readonly modals = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(ASSOCIATION_INJECTOR);
  private readonly location = inject(Location);

  protected readonly focusedEvents = signal<AudioEvent[] | null>(null);
  protected readonly searchParameters =
    signal<AnnotationMapParameters | null>(null);
  protected readonly annotationSearchParameters =
    signal<AnnotationSearchParameters | null>(null);

  protected readonly eventGroups = computed(() => {
    const searchFilters = this.annotationSearchParameters().toFilter?.() ?? {};

    const request = this.groupedEventsService
      .filterGroupBy({ filter: searchFilters.filter })
      .pipe(first(), takeUntil(this.unsubscribe));

    return firstValueFrom(request);
  });

  private readonly searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");

  protected get moreEventsUrl() {
    const searchParams = this.annotationSearchParameters();

    // We use isInstantiated instead of a truthy check because a project with an
    // id of 0 is valid but would fail a truthy assertion.
    if (isInstantiated(searchParams.routeProjectId)) {
      return annotationSearchRoute.project;
    } else if (isInstantiated(searchParams.routeRegionId)) {
      if (isInstantiated(searchParams.routeSiteId)) {
        return annotationSearchRoute.siteAndRegion;
      } else {
        return annotationSearchRoute.region;
      }
    } else if (isInstantiated(searchParams.routeSiteId)) {
      return annotationSearchRoute.site;
    }

    throw new Error("Cannot determine correct annotation search route");
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.annotationSearchParameters.update((current) => {
      const newModel =
        current ?? (models[annotationSearchParametersKey] as AnnotationSearchParameters);
      newModel.injector = this.injector;
      newModel.includeVerificationParams = false;

      newModel.routeProjectModel ??= models[projectKey] as Project;

      if (models[regionKey]) {
        newModel.routeRegionModel ??= models[regionKey] as Region;
      }

      if (models[siteKey]) {
        newModel.routeSiteModel ??= models[siteKey] as Site;
      }

      return newModel;
    });

    this.searchParameters.update((current) => {
      return current ?? (models[searchParametersKey] as AnnotationMapParameters);
    });

    // We use isInstantiated instead of a truthy check because a focused site id
    // of 0 is valid but would fail a truthy assertion.
    const initialFocusedSite = this.searchParameters().focused;
    if (isInstantiated(initialFocusedSite)) {
      this.handleSiteFocused(initialFocusedSite);
    }
  }

  protected handleSiteFocused(siteId: Id<Site>): void {
    this.focusSite(siteId);
  }

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal(), { size: "xl" });
  }

  protected previewEvent(event: AudioEvent): void {
    const modalRef = this.modals.open(EventModalComponent, { size: "xl" });
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.event = event;
  }

  protected focusSite(siteId: Id<Site>): void {
    // We set the query parameter before the filter request so that if the
    // request fails, the user can refresh the page to try again.
    this.searchParameters.update((params) => {
      if (params) {
        params.focused = siteId;
      }

      return params;
    });

    this.updateUrlParameters();
    this.updateFocusedEvents();
  }

  /**
    * De-focus' the current site and hides the event table modal on mobile
    * devices.
    */
  protected defocusSite(): void {
    this.searchParameters.update((current) => {
      current.focused = null;
      return current;
    });

    this.updateUrlParameters();
  }

  protected updateSearchParameters(newParams: AnnotationSearchParameters): void {
    this.annotationSearchParameters.set(newParams);
    this.updateUrlParameters();
  }

  private updateUrlParameters(): void {
    const queryParams: Params = {
      ...this.searchParameters().toQueryParams(),
      ...this.annotationSearchParameters().toQueryParams(),
    };

    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(`${urlTree}`);

    this.updateFocusedEvents();
  }

  private updateFocusedEvents(): void {
    const filters: Filters<AudioEvent> = {
      filter: this.annotationSearchParameters().toFilter()?.filter ?? {},
      paging: {
        items: 5,
      },
      sorting: {
        orderBy: "score",
        direction: "desc",
      },
    };

    this.audioEventsApi
      .filterBySite(filters, this.searchParameters().focused)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((events) => {
        this.focusedEvents.set(events);
      });
  }
}

function getPageInfo(subRoute: keyof typeof annotationMenuItems.map): IPageInfo {
  return {
    pageRoute: annotationMenuItems.map[subRoute],
    category: annotationCategories.map[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [searchParametersKey]: annotationMapParameterResolvers.showOptional,
      [annotationSearchParametersKey]: annotationSearchParametersResolvers.showOptional,
    },
    fullscreen: true,
  };
}

AnnotationMapPageComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { AnnotationMapPageComponent };
