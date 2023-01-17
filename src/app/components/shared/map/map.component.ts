import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { googleMapsLoaded } from "@helpers/embedScript/embedGoogleMaps";
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
    <!-- Display map -->
    <ng-container *ngIf="hasMarkers && googleMapsLoaded">
      <google-map
        height="100%"
        width="100%"
        [options]="mapOptions"
        (mapClick)="markerOptions?.draggable && newLocation.emit($event)"
      >
        <map-marker
          *ngFor="let marker of filteredMarkers"
          [options]="markerOptions"
          [position]="marker.position"
          (mapDragend)="newLocation.emit($event)"
        >
        </map-marker>
        <map-info-window>{{ infoContent }}</map-info-window>
      </google-map>
    </ng-container>

    <!-- Map is loading -->
    <ng-container *ngIf="hasMarkers && !googleMapsLoaded">
      <div class="map-placeholder"><p>Map loading</p></div>
    </ng-container>

    <!-- No map markers to display -->
    <ng-container *ngIf="!hasMarkers">
      <div class="map-placeholder"><p>No locations specified</p></div>
    </ng-container>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent
  extends withUnsubscribe()
  implements OnChanges, AfterViewChecked
{
  @ViewChild(GoogleMap, { static: false }) public map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) public info: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers: QueryList<MapMarker>;

  @Input() public markers: List<MapMarker>;
  @Input() public markerOptions: MapMarkerOptions;
  @Output() public newLocation = new EventEmitter<google.maps.MapMouseEvent>();

  public filteredMarkers: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: MapOptions = { mapTypeId: "satellite" };
  public bounds: google.maps.LatLngBounds;
  private updateMap: boolean;

  public get googleMapsLoaded(): boolean {
    return googleMapsLoaded();
  }

  public ngOnChanges(): void {
    this.hasMarkers = false;
    this.filteredMarkers = [];

    // Google global may not be declared
    if (!this.googleMapsLoaded) {
      return;
    }

    // Calculate pin boundaries so that map can be auto-focused properly
    this.bounds = new google.maps.LatLngBounds();
    this.markers?.forEach((marker): void => {
      if (isMarkerValid(marker)) {
        this.hasMarkers = true;
        this.filteredMarkers.push(marker);
        this.bounds.extend(marker.position);
      }
    });
    this.updateMap = true;
  }

  public ngAfterViewChecked(): void {
    if (!this.map || !this.hasMarkers || !this.updateMap) {
      return;
    }

    this.updateMap = false;
    this.map.fitBounds(this.bounds);
    this.map.panToBounds(this.bounds);
    // Setup info windows for each marker
    this.mapMarkers?.forEach((marker, index) => {
      marker.mapMouseover.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (): void => {
          this.infoContent = this.filteredMarkers[index].label as string;
          this.info.open(marker);
        },
        error: (): void =>
          console.error("Failed to create info content for map marker"),
      });
    });
  }
}

/**
 * Validate a marker
 *
 * @param marker Marker to validate
 */
function isMarkerValid(marker: MapMarker): boolean {
  return (
    typeof marker?.position?.lat === "number" &&
    typeof marker?.position?.lng === "number"
  );
}

/**
 * Handles sanitization of map markers so change detection will run properly
 */
export function sanitizeMapMarkers(
  markers: MapMarker | MapMarker[]
): List<MapMarker> {
  const output: MapMarker[] = [];

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

export type MapMarkerOptions = google.maps.MarkerOptions;
export type MapOptions = google.maps.MapOptions;
