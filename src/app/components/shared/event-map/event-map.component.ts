import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { toNumber } from "@helpers/typing/toNumber";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { Site } from "@models/Site";
import { AudioEventGroup } from "@models/AudioEventGroup";

@Component({
  selector: "baw-event-map",
  templateUrl: "./event-map.component.html",
  styleUrl: "./event-map.component.scss",
  imports: [MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapComponent {
  public readonly events = input.required<AudioEventGroup[]>();

  public readonly siteClicked = output<Site["id"]>();

  protected readonly focusedSiteId = signal<Site["id"] | null>(null);
  protected readonly markers = computed(() => {
    const newMarkers = this.events().map((group) => {
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

    return List(newMarkers);
  });

  protected handleMarkerClicked(marker: MapMarkerOptions): void {
    const focusedSite = marker.siteId;
    if (focusedSite === this.focusedSiteId()) {
      return;
    }

    this.focusedSiteId.set(focusedSite);
    this.siteClicked.emit(focusedSite);
  }
}
