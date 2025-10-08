import {
  Component,
  computed,
  inject,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  viewChild,
  ViewChild,
} from "@angular/core";
import {
  GoogleMap,
  MapAnchorPoint,
  MapInfoWindow,
  MapMarkerClusterer,
  MapAdvancedMarker,
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
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { interpolateSinebow } from "node_modules/d3-scale-chromatic";
import { LoadingComponent } from "../loading/loading.component";
import { Observable, Subject } from "rxjs";

/**
 * Google Maps Wrapper Component
 */
@Component({
  selector: "baw-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
  imports: [
    GoogleMap,
    MapAdvancedMarker,
    MapMarkerClusterer,
    MapInfoWindow,
    LoadingComponent,
  ],
})
export class MapComponent extends withUnsubscribe() implements OnChanges {
  private readonly mapService = inject(MapsService);
  private readonly isServer = inject(IS_SERVER_PLATFORM);

  public readonly markers = input.required<List<MapMarkerOptions>>();
  public readonly markerOptions = input<Partial<MapMarkerOptions>>();
  public readonly fetchingData = input(false);

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public readonly mapOptions = input<MapOptions>({ mapTypeId: "satellite" });

  public readonly newLocation = output<google.maps.MapMouseEvent>();

  public bounds: google.maps.LatLngBounds;
  public validMarkersOptions: MapMarkerOptions[];
  public hasMarkers = false;
  private _map: GoogleMap;

  protected readonly infoContent = signal("");

  protected readonly MapLoadState = GoogleMapsState;
  protected readonly mapsLoadState = signal<GoogleMapsState>(
    this.MapLoadState.Loading,
  );

  protected readonly groups = computed<unknown[]>(() => {
    const groupSet = new Set<unknown>();
    this.validMarkersOptions.forEach((marker) => {
      if (marker.groupId !== undefined) {
        groupSet.add(marker.groupId);
      }
    });

    return Array.from(groupSet);
  });

  protected readonly hasMapsLoaded = computed(() => {
    return (
      this.mapsLoadState() === GoogleMapsState.Loaded && !this.fetchingData()
    );
  });

  public readonly info = viewChild(MapInfoWindow);

  @ViewChild(GoogleMap)
  private set map(value: GoogleMap) {
    this._map = value;
    this.focusMarkers();
  }

  public constructor() {
    super();

    if (this.isServer) {
      this.mapsLoadState.set(GoogleMapsState.NotLoaded);
      return;
    }

    this.mapService
      .loadAsync()
      .then((success: boolean) => {
        const newState = success
          ? GoogleMapsState.Loaded
          : GoogleMapsState.Failed;
        this.mapsLoadState.set(newState);
      })
      .catch(() => {
        // We issue a console warning before transitioning to the failed state
        // so if transitioning to the failed state causes a hard error, we have
        // a fallback log message.
        console.warn("Failed to load Google Maps");
        this.mapsLoadState.set(GoogleMapsState.Failed);
      });
  }

  /**
   * Runs when new markers are added/removed
   * This is possible because the markers are an immutable list
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ("markers" in changes) {
      this.updateFilteredMarkers();
    }
  }

  protected initMarker(
    options: MapMarkerOptions,
    marker: MapAdvancedMarker,
  ): void {
    marker.advancedMarker.addEventListener("pointerover", () => {
      this.addMapMarkerInfo(options, marker);
    });

    this.focusMarkers();
  }

  protected addMapMarkerInfo(
    options: MapMarkerOptions,
    marker: MapAnchorPoint,
  ): void {
    this.infoContent.set(options.title ?? "");
    this.info().open(marker);
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

  protected markerContent(marker: MapMarkerOptions): HTMLElement {
    const color = this.markerColor(marker);
    const pinElement = new google.maps.marker.PinElement({
      background: color,
      borderColor: color,
      glyphColor: "white",
    });

    return pinElement.element;
  }

  private markerColor(marker: MapMarkerOptions): string {
    const offset = 0;
    const count = this.groups().length;
    const index = this.groups().indexOf(marker.groupId);
    if (index === -1 || count === 0) {
      return "hsl(0, 100%, 50%)"; // Red
    }

    const scalar = (offset + (1 / count) * index ) % 1
    const color = interpolateSinebow(scalar);

    return color;
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
  markers: MapMarkerOptions | MapMarkerOptions[],
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
