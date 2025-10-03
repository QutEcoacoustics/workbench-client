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
import { DOCUMENT } from "@angular/common";
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
  private readonly document = inject(DOCUMENT);

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

  // https://github.com/googlemaps/js-markerclusterer/blob/9eabdf753ae9af5af1/examples/renderers.ts#L36
  protected clusterRenderer(): Renderer {
    const colorStops = {
      1: "lightest",
      5: "lighter",
      10: "default",
      20: "darker",
      50: "darkest",
      Infinity: "darkest",
    } as const;

    return {
      render: (options: { count: number; position: google.maps.LatLng }) => {
        // Find the last color stop that is less than or equal to the current count
        const variant = Object.entries(colorStops).reduce((acc, [key, value]) => {
          return options.count >= Number(key) ? value : acc;
        }, "lightest");

        let color = `var(--baw-highlight-${variant})`;
        if (color === "var(--baw-highlight-default)") {
          color = "var(--baw-highlight)";
        }

        // create svg url with fill color
        const clusterContent = this.document.createElement("span");
        clusterContent.style.display = "inline-block";
        clusterContent.style.width = "2em";
        clusterContent.style.height = "2em";
        clusterContent.style.borderRadius = "50%";
        clusterContent.style.backgroundColor = color;
        clusterContent.style.color = "white";
        clusterContent.style.display = "flex";
        clusterContent.style.alignItems = "center";
        clusterContent.style.justifyContent = "center";
        clusterContent.style.fontSize = "1.25rem";
        clusterContent.style.fontWeight = "bold";
        clusterContent.style.border = `2px solid ${color}`;

        clusterContent.innerHTML = `
          <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <circle cx="120" cy="120" opacity=".4" r="70" />
            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
              fill="white"
              font-size="90px"
              font-family="Arial, sans-serif"
              font-weight="bold"
            >
              ${options.count}
            </text>
          </svg>
        `;

        return new google.maps.marker.AdvancedMarkerElement({
          position: options.position,
          content: clusterContent,
          title: String(options.count),

          // adjust zIndex so that the cluster is above regular markers
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
