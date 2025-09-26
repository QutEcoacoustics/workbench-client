import {
  Component,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  GoogleMap,
  MapAnchorPoint,
  MapInfoWindow,
  MapMarker,
} from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  GoogleMapsState,
  MapMarkerOptions,
  MapOptions,
  MapsService,
} from "@services/maps/maps.service";
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
      .then((success: boolean) => {
        const newLoadState = success ? GoogleMapsState.Loaded : GoogleMapsState.Failed;
        this.googleMapsLoaded.set(newLoadState);
      })
      .catch(() => {
        // We issue a console warning before transitioning to the failed state
        // so if transitioning to the failed state causes a hard error, we have
        // a fallback log message.
        console.warn("Failed to load Google Maps");
        this.googleMapsLoaded.set(GoogleMapsState.Failed);
      });
  }

  @ViewChild(MapInfoWindow) public info?: MapInfoWindow;

  @ViewChild(GoogleMap)
  private set map(value: GoogleMap) {
    this._map = value;
    this.focusMarkers();
  }

  public readonly markers = input.required<List<MapMarkerOptions>>();
  public readonly markerOptions = input<MapMarkerOptions>();
  public newLocation = output<google.maps.MapMouseEvent>();

  public validMarkersOptions: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";
  private _map: GoogleMap;

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: MapOptions = { mapTypeId: "satellite" };
  public bounds: google.maps.LatLngBounds;

  protected readonly googleMapsLoaded = signal<GoogleMapsState>(GoogleMapsState.Loading);
  protected readonly MapLoadState = GoogleMapsState;

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
    this.infoContent = options.title as string;
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

    this.markers()?.forEach((marker) => {
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
  return (
    typeof marker?.position?.lat === "number" &&
    typeof marker?.position?.lng === "number"
  );
}

/**
 * Handles sanitization of map markers so change detection will run properly
 */
export function sanitizeMapMarkers(
  markers: MapMarkerOptions | MapMarkerOptions[]
): List<MapMarkerOptions> {
  const markerOptions: MapMarkerOptions[] = [];

  if (markers instanceof Array) {
    markers.forEach((marker) => {
      if (isMarkerValid(marker)) {
        markerOptions.push(marker);
      }
    });
  } else {
    if (isMarkerValid(markers)) {
      markerOptions.push(markers);
    }
  }

  return List(markerOptions);
}
