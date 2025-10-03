import {
  Component,
  computed,
  inject,
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
  MapMarkerClusterer,
  Renderer,
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
import { LoadingComponent } from "../loading/loading.component";

/**
 * Google Maps Wrapper Component
 */
@Component({
  selector: "baw-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
  imports: [
    GoogleMap,
    MapMarker,
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

  public validMarkersOptions: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";
  private _map: GoogleMap;

  public bounds: google.maps.LatLngBounds;

  protected readonly MapLoadState = GoogleMapsState;
  protected readonly mapsLoadState = signal<GoogleMapsState>(
    this.MapLoadState.Loading,
  );

  protected readonly hasMapsLoaded = computed(() => {
    return (
      this.mapsLoadState() === GoogleMapsState.Loaded && !this.fetchingData()
    );
  });

  @ViewChild(MapInfoWindow) public info?: MapInfoWindow;

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

  protected addMapMarkerInfo(
    options: MapMarkerOptions,
    marker: MapAnchorPoint,
  ): void {
    this.infoContent = options.title ?? "";
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

  protected clusterRenderer(): Renderer {
    return {
      render: (options: { count: number; position: google.maps.LatLng }) => {
        const div = document.createElement("div");
        div.className = "cluster-marker";
        div.textContent = String(options.count);
        return new google.maps.Marker({
          position: options.position,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                  <circle cx="20" cy="20" r="20" fill="var(--baw-highlight)" />
                  <text x="20" y="25" font-size="15" fill="white" text-anchor="middle">${options.count}</text>
                </svg>
              `),
            scaledSize: new google.maps.Size(40, 40),
          },
          label: {
            text: String(options.count),
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          },
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + options.count,
        });
      }
    };
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
