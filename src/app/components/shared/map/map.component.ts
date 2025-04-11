import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { GoogleMap, MapAnchorPoint, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MapMarkerOptions, MapOptions, MapsService } from "@services/maps/maps.service";
import { List } from "immutable";
import { LoadingComponent } from "../loading/loading.component";

/**
 * Google Maps Wrapper Component
 */
@Component({
  selector: "baw-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
  imports: [GoogleMap, MapMarker, MapInfoWindow, LoadingComponent],
})
export class MapComponent extends withUnsubscribe() implements OnChanges {
  public constructor(private mapService: MapsService) {
    super();

    this.mapService
      .loadAsync()
      .then((success: boolean) => (this.googleMapsLoaded = success))
      .catch(() => console.warn("Failed to load Google Maps"));
  }

  @ViewChild(MapInfoWindow) public info?: MapInfoWindow;

  @ViewChild(GoogleMap)
  private set map(value: GoogleMap) {
    this._map = value;
    this.focusMarkers();
  }

  @Input() public markers: List<MapMarkerOptions>;
  @Input() public markerOptions: MapMarkerOptions;
  @Output() public newLocation = new EventEmitter<google.maps.MapMouseEvent>();

  public validMarkersOptions: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";
  private _map: GoogleMap;

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: MapOptions = { mapTypeId: "satellite" };
  public bounds: google.maps.LatLngBounds;
  protected googleMapsLoaded: boolean | null = null;

  /**
   * Runs when new markers are added/removed
   * This is possible because the markers are an immutable list
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ("markers" in changes) {
      this.updateFilteredMarkers();
    }
  }

  protected addMapMarkerInfo(options: MapMarkerOptions, marker: MapAnchorPoint): void {
    this.infoContent = options.label as string;
    this.info.open(marker);
  }

  /**
   * Moves the maps viewport to fit all `filteredMarkers` by calculating marker
   * boundaries so that the map has all markers in focus
   */
  protected focusMarkers(): void {
    if (!this._map || !this.hasMarkers) {
      return;
    }

    this.bounds = new google.maps.LatLngBounds();
    this.validMarkersOptions.forEach((marker) => {
      this.bounds.extend(marker.position);
    });

    this._map.fitBounds(this.bounds);
    this._map.panToBounds(this.bounds);
  }

  /**
   * Extracts valid markers into `validMarkers`
   */
  private updateFilteredMarkers(): void {
    this.hasMarkers = false;
    this.validMarkersOptions = [];

    this.markers?.forEach((marker) => {
      if (isMarkerValid(marker)) {
        this.hasMarkers = true;
        this.validMarkersOptions.push(marker);
      }
    });
  }
}

/**
 * Validate a marker
 *
 * @param marker Marker to validate
 */
function isMarkerValid(marker: MapMarkerOptions): boolean {
  return typeof marker?.position?.lat === "number" && typeof marker?.position?.lng === "number";
}

/**
 * Handles sanitization of map markers so change detection will run properly
 */
export function sanitizeMapMarkers(markers: MapMarkerOptions | MapMarkerOptions[]): List<MapMarkerOptions> {
  const output: MapMarkerOptions[] = [];

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
