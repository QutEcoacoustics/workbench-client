import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
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
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { AsyncPipe } from "@angular/common";
import { annotationResolvers } from "@services/models/annotations/annotation.resolver";
import { ActivatedRoute, Router } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { EventModalComponent } from "@shared/event-modal/event-modal.component";
import { eventCategories, eventMenuitems } from "../../events.menus";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const annotationsKey = "annotations";

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
  ],
})
class EventsPageComponent extends PageComponent implements OnInit {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly audioEventsApi = inject(ShallowAudioEventsService);
  private readonly modals = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(ASSOCIATION_INJECTOR);

  protected readonly focusedEvents = signal<AudioEvent[] | null>(null);
  protected readonly searchParameters =
    model<AnnotationSearchParameters | null>(null);

  protected readonly eventGroups = computed(() => {
    const filters = {};

    const request = this.groupedEventsService
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe));

    return firstValueFrom(request);
  });

  private readonly searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.searchParameters.update((current) => {
      const newModel =
        current ?? (models[annotationsKey] as AnnotationSearchParameters);
      newModel.injector = this.injector;

      newModel.routeProjectModel ??= models[projectKey] as Project;

      if (models[regionKey]) {
        newModel.routeRegionModel ??= models[regionKey] as Region;
      }

      if (models[siteKey]) {
        newModel.routeSiteModel ??= models[siteKey] as Site;
      }

      return newModel;
    });
  }

  protected handleSiteClicked(siteId: Site["id"]): void {
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

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal(), { size: "xl" });
  }

  protected previewEvent(event: AudioEvent): void {
    const modalRef = this.modals.open(EventModalComponent, { size: "xl" });
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.event = event;
  }

  private focusSite(siteId: Site["id"]): void {
    this.router.navigate([], {
      queryParams: { focused: siteId },
      queryParamsHandling: "merge",
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
      [annotationsKey]: annotationResolvers.showOptional,
    },
    fullscreen: true,
  };
}

EventsPageComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { EventsPageComponent };
