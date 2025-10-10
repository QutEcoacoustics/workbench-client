import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  viewChild,
} from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { GroupedAudioEventsService } from "@baw-api/grouped-audio-events/grouped-audio-events.service";
import { toNumber } from "@helpers/typing/toNumber";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { first, takeUntil } from "rxjs";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { AudioEvent } from "@models/AudioEvent";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { Site } from "@models/Site";

@Component({
  selector: "baw-event-map",
  templateUrl: "./event-map.component.html",
  styleUrl: "./event-map.component.scss",
  imports: [MapComponent, SearchFiltersModalComponent, InlineListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapComponent extends withUnsubscribe() implements OnChanges {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly modals = inject(NgbModal);
  private readonly audioEventsApi = inject(ShallowAudioEventsService);

  public readonly eventFilters = input.required<Filters>({});

  protected readonly markers = signal(List<MapMarkerOptions>());
  protected readonly searchParameters =
    input<AnnotationSearchParameters | null>(null);
  protected readonly focusedEvents = signal<AudioEvent[]>([]);
  protected readonly focusedSiteId = signal<Site["id"] | null>(null);

  private readonly searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["eventFilters"]) {
      this.updateMarkers();
    }
  }

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal(), { size: "xl" });
  }

  protected updateSearchFilters(newModel: AnnotationSearchParameters): void {
    this.updateMarkers();
  }

  protected markerClicked(marker: MapMarkerOptions): void {
    const focusedSite = marker.siteId;
    if (focusedSite === this.focusedSiteId()) {
      return;
    }

    this.focusedSiteId.set(focusedSite);

    const filters: Filters<AudioEvent> = {
      projection: {
        include: ["id", "score", "taggings"],
      },
      paging: {
        items: 5,
      },
    };

    this.audioEventsApi
      .filterBySite(filters, focusedSite)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((events) => {
        this.focusedEvents.set(events);
      });
  }

  private async updateMarkers() {
    const filters = this.eventFilters();
    this.groupedEventsService
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((groups) => {
        const newMarkers = groups.map((group) => {
          return {
            position: {
              lat: toNumber(group.latitude),
              lng: toNumber(group.longitude),
            },
            title: `${group.eventCount} Events`,
            count: group.eventCount,
            siteId: group.siteId,
          };
        });

        this.markers.set(List(newMarkers));
      });
  }
}
