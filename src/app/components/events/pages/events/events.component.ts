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
import { AsyncPipe, Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
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
import { eventCategories, eventMenuitems } from "../../events.menus";
import { eventMapResolvers } from "./events.resolver";
import { EventMapSearchParameters } from "./eventMapSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const searchParametersKey = "eventMapSearchParameters";

enum FocusFetchState {
  Fetching,
  Failed,
  Loaded,
}

@Component({
  selector: "baw-events-map-page",
  templateUrl: "./events.component.html",
  styleUrl: "./events.component.scss",
  imports: [
    EventMapComponent,
    InlineListComponent,
    SearchFiltersModalComponent,
    FaIconComponent,
    NgbTooltip,
    AsyncPipe,
    UrlDirective,
    StrongRouteDirective,
  ],
})
class EventsPageComponent extends PageComponent implements OnInit {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly audioEventsApi = inject(ShallowAudioEventsService);
  private readonly modals = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(ASSOCIATION_INJECTOR);
  private readonly location = inject(Location);

  protected readonly FocusFetchState = FocusFetchState;
  protected readonly trayFetchState = signal<FocusFetchState>(this.FocusFetchState.Loaded);
  protected readonly isTrayOpen = signal(true);

  protected readonly focusedEvents = signal<AudioEvent[] | null>(null);
  protected readonly searchParameters =
    signal<EventMapSearchParameters | null>(null);

  protected readonly eventGroups = computed(() => {
    const filters = this.searchParameters().toFilter() ?? {};

    const request = this.groupedEventsService
      .filterGroupBy(filters as any)
      .pipe(first(), takeUntil(this.unsubscribe));

    return firstValueFrom(request);
  });

  private readonly searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");

  protected get moreEventsUrl() {
    const searchParams = this.searchParameters();

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
    this.searchParameters.update((current) => {
      const newModel =
        current ?? (models[searchParametersKey] as EventMapSearchParameters);
      newModel.injector = this.injector;

      newModel.routeProjectModel ??= models[projectKey] as Project;

      if (models[regionKey]) {
        newModel.routeRegionModel ??= models[regionKey] as Region;
      }

      if (models[siteKey]) {
        newModel.routeSiteModel ??= models[siteKey] as Site;
      }

      if (isInstantiated(newModel.focused)) {
        this.focusSite(newModel.focused);
      }

      return newModel;
    });
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

  protected toggleTray(): void {
    this.isTrayOpen.update((value) => !value);
  }

protected updateSearchParameters(newParams: EventMapSearchParameters): void {
    this.searchParameters.set(newParams);

    // We use the searchParameters modal as the source of truth instead of the
    // newParams argument so that if the search parameters class rejects the
    // update (for some reason), we don't try to focus on an invalid site.
    const newFocusedSite = this.searchParameters().focused;
    if (isInstantiated(newFocusedSite)) {
      this.focusSite(newFocusedSite);
    }

    this.updateUrlParameters();
  }

  private updateUrlParameters(): void {
    const queryParams = this.searchParameters().toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(urlTree.toString());
  }

  private focusSite(siteId: Id<Site>): void {
    // We set the query parameter before the filter request so that if the
    // request fails, the user can refresh the page to try again.
    this.router.navigate([], {
      queryParams: { focused: siteId },
      queryParamsHandling: "merge",
    });

    const filters: Filters<AudioEvent> = {
      paging: {
        items: 5,
      },
      sorting: {
        orderBy: "score",
        direction: "desc",
      },
    };

    this.audioEventsApi
      .filterBySite(filters, siteId)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((events) => {
        this.focusedEvents.set(events);
      });
  }
}

function getPageInfo(subRoute: keyof typeof eventMenuitems.map): IPageInfo {
  return {
    pageRoute: eventMenuitems.map[subRoute],
    category: eventCategories.map[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [searchParametersKey]: eventMapResolvers.showOptional,
    },
    fullscreen: true,
  };
}

EventsPageComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { EventsPageComponent };
