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
import { MapMarkerOptions, MapsService } from "@services/maps/maps.service";
import { MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { first, takeUntil } from "rxjs";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";

@Component({
  selector: "baw-event-map",
  templateUrl: "./event-map.component.html",
  styleUrl: "./event-map.component.scss",
  imports: [MapComponent, SearchFiltersModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapComponent extends withUnsubscribe() implements OnChanges {
  private readonly groupedEventsService = inject(GroupedAudioEventsService);
  private readonly mapsService = inject(MapsService);
  private readonly modals = inject(NgbModal);

  public readonly eventFilters = input.required<Filters>({});

  protected readonly markers = signal(List<MapMarkerOptions>());
  protected readonly searchParameters =
    input<AnnotationSearchParameters | null>(null);

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
    console.log(marker);
  }

  private async updateMarkers() {
    const filters = this.eventFilters();
    this.groupedEventsService.filter(filters).pipe(
      first(),
      takeUntil(this.unsubscribe),
    ).subscribe((groups) => {
      const newMarkers = groups.map((group) => {
        return  {
          position: {
            lat: toNumber(group.latitude),
            lng: toNumber(group.longitude),
          },
          count: group.eventCount,
          siteId: group.siteId,
        };
      });

      this.markers.set(List(newMarkers));
    });
  }
}
