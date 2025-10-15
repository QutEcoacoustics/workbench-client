import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { Site } from "@models/Site";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { Id } from "@interfaces/apiInterfaces";
import { UrlDirective } from "@directives/url/url.directive";

@Component({
  selector: "baw-event-map",
  templateUrl: "./event-map.component.html",
  styleUrl: "./event-map.component.scss",
  imports: [MapComponent, UrlDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapComponent {
  public readonly events = input.required<AudioEventGroup[]>();

  public readonly siteFocused = output<Id<Site>>();

  protected readonly focusedSiteId = signal<Id<Site> | null>(null);
  protected readonly markers = computed(() => {
    const newMarkers = this.events().map((group) => {
      return {
        position: {
          lat: group.latitude,
          lng: group.longitude,
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
    this.siteFocused.emit(focusedSite);
  }
}
