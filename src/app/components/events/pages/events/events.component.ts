import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
import { eventCategories, eventMenuitems } from "../../events.menus";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-events-map-page",
  templateUrl: "./events.component.html",
  styleUrl: "./events.component.scss",
  imports: [
    EventMapComponent,
    InlineListComponent,
    SearchFiltersModalComponent,
    FaIconComponent,
    AsyncPipe,
  ],
})
class EventsPageComponent extends PageComponent {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly audioEventsApi = inject(ShallowAudioEventsService);
  private readonly modals = inject(NgbModal);

  protected readonly focusedEvents = signal<AudioEvent[] | null>(null);
  protected readonly searchParameters = model<AnnotationSearchParameters>({} as any);

  protected readonly eventGroups = computed(() => {
    const filters = {};

    const request = this.groupedEventsService
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe));

    return firstValueFrom(request);
  });

  private readonly searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");

  protected handleSiteClicked(siteId: Site["id"]): void {
    const filters: Filters<AudioEvent> = {
      projection: {
        include: ["id", "score", "taggings"],
      },
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
}

function getPageInfo(subRoute: keyof typeof eventMenuitems.map): IPageInfo {
  return {
    pageRoute: eventMenuitems.map[subRoute],
    category: eventCategories.map[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
    fullscreen: true,
  };
}

EventsPageComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { EventsPageComponent };
