import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

/**
 * Google Maps Wrapper Component
 * ! Manually test when editing, unit test coverage is poor
 */
@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
      <google-map height="100%" width="100%" [options]="mapOptions">
        <map-marker
          *ngFor="let marker of filteredMarkers"
          [options]="markerOptions"
          [position]="marker.position"
        >
        </map-marker>
        <map-info-window>{{ infoContent }}</map-info-window>
      </google-map>
    </ng-container>
    <ng-template #placeholderMap>
      <div class="map-placeholder"><p>No locations specified</p></div>
    </ng-template>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent extends withUnsubscribe() implements OnChanges {
  @ViewChild(GoogleMap, { static: false }) public map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) public info: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers: QueryList<MapMarker>;

  @Input() public markers: List<MapMarkerOption>;
  public filteredMarkers: MapMarkerOption[];
  public hasMarkers = false;
  public infoContent = "";

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: google.maps.MapOptions = { mapTypeId: "satellite" };
  public markerOptions: google.maps.MarkerOptions = {};

  public constructor(private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnChanges() {
    this.hasMarkers = false;
    this.filteredMarkers = [];
    // Calculate pin boundaries so that map can be auto-focused properly
    const bounds = new google.maps.LatLngBounds();
    this.markers?.forEach((marker) => {
      if (isMarkerValid(marker)) {
        this.hasMarkers = true;
        this.filteredMarkers.push(marker);
        bounds.extend(marker.position);
      }
    });

    if (!this.hasMarkers) {
      return;
    }

    // Detect changes required so map loads
    this.ref.detectChanges();
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
    // Setup info windows for each marker
    this.mapMarkers?.forEach((marker, index) => {
      marker.mapMouseover.pipe(takeUntil(this.unsubscribe)).subscribe(
        () => {
          this.infoContent = this.filteredMarkers[index].label as string;
          this.info.open(marker);
        },
        () => console.error("Failed to create info content for map marker")
      );
    });
  }
}

/**
 * Validate a marker
 *
 * @param marker Marker to validate
 */
function isMarkerValid(marker: MapMarkerOption): boolean {
  return (
    typeof marker?.position?.lat === "number" &&
    typeof marker?.position?.lng === "number"
  );
}

/**
 * Handles sanitization of map markers so change detection will run properly
 */
export function sanitizeMapMarkers(
  markers: MapMarkerOption | MapMarkerOption[]
): List<MapMarkerOption> {
  const output: MapMarkerOption[] = [];

  if (markers instanceof Array) {
    markers.forEach((marker) => {
      if (isMarkerValid(marker)) {
        output.push(marker);
      }
    });
  } else {
    if (isMarkerValid(markers)) {
      output.push(markers);
    }
  }

  return List(output);
}

export type MapMarkerOption = google.maps.ReadonlyMarkerOptions;
