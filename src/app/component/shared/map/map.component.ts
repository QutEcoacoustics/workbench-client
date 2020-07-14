import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { takeUntil } from "rxjs/operators";
import { Site } from "src/app/models/Site";

/**
 * Google Maps Wrapper Component
 * ! Manually test when editing. No unit tests written
 */
@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
      <google-map height="400px" width="100%" [options]="mapOptions">
        <map-marker
          *ngFor="let marker of markers"
          [options]="markerOptions"
          [position]="marker.position"
        >
        </map-marker>
        <map-info-window>{{ infoContent }}</map-info-window>
      </google-map>
    </ng-container>
    <ng-template #placeholderMap>
      <div class="map-placeholder"><span>No locations specified</span></div>
    </ng-template>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent extends WithUnsubscribe() implements OnChanges {
  @ViewChild(GoogleMap, { static: false }) public map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) public info: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers: QueryList<MapMarker>;

  @Input() public sites: Site[];
  public hasMarkers = false;
  public infoContent = "";
  public markers: google.maps.ReadonlyMarkerOptions[] = [];

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions = { mapTypeId: "satellite" };
  public markerOptions = { draggable: false };

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnChanges() {
    this.markers = createMarkers(this.sites);
    this.hasMarkers = this.markers.length > 0;
    this.ref.detectChanges();

    // Calculate pin boundaries so that map can be auto-focused properly
    if (this.hasMarkers) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => bounds.extend(marker.position));
      this.map.fitBounds(bounds);
      this.map.panToBounds(bounds);
    }

    // Setup info windows for each marker
    this.mapMarkers?.forEach((marker, index) => {
      marker.mapMouseover.pipe(takeUntil(this.unsubscribe)).subscribe(
        () => {
          this.infoContent = this.markers[index].label as string;
          this.info.open(marker);
        },
        () => console.error("Failed to create info content for map marker")
      );
    });
  }
}

/**
 * Create list of markers for map
 * @param sites List of sites
 * @returns List of markers
 */
export function createMarkers(
  sites: Site[]
): google.maps.ReadonlyMarkerOptions[] {
  const markers = [];
  sites?.forEach((site) => {
    const hasLatitude = typeof site.customLatitude === "number";
    const hasLongitude = typeof site.customLongitude === "number";

    if (hasLatitude && hasLongitude) {
      markers.push({
        position: {
          lat: site.customLatitude,
          lng: site.customLongitude,
        },
        label: site.name,
      });
    }
  });
  return markers;
}
