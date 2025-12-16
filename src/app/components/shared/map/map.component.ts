import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  TemplateRef,
  viewChild,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import type { Algorithm, Renderer } from "@angular/google-maps";
import {
  GoogleMap,
  MapAdvancedMarker,
  MapAnchorPoint,
  MapInfoWindow,
  MapMarkerClusterer,
} from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  GoogleMapsState,
  MapMarkerOptions,
  MapOptions,
  MapsService,
} from "@services/maps/maps.service";
import { interpolateSinebow } from "d3-scale-chromatic";
import { List } from "immutable";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { interpolateSinebow } from "d3-scale-chromatic";
import { NgTemplateOutlet } from "@angular/common";
import { LoadingComponent } from "../loading/loading.component";
import { ClusterRenderer } from "./clusterRenderer";
import { WeightedSuperClusterAlgorithm } from "./weightedSuperClusterAlgorithm";

type MarkerGroup = unknown;

interface MarkerTemplate {
  marker: MapMarkerOptions;
}

type WeightedAdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement & {
  clusterWeight?: number;
};

/**
 * Google Maps Wrapper Component
 *
 * @slot marker
 * A template for markers
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
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent extends withUnsubscribe() implements OnChanges {
  private readonly mapService = inject(MapsService);
  private readonly isServer = inject(IS_SERVER_PLATFORM);
  private readonly viewContainer = inject(ViewContainerRef);

  public readonly markers = input.required<List<MapMarkerOptions>>();
  public readonly markerOptions =
    input<google.maps.marker.AdvancedMarkerElementOptions>();

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public readonly mapOptions = input<MapOptions>({ mapTypeId: "satellite" });
  public readonly fetchingData = input(false);

  public readonly newLocation = output<google.maps.MapMouseEvent>();

  /**
   * An event that is emitted when the marker is clicked with the mouse or
   * through a keyboard event.
   */
  public readonly markerClicked = output<MapMarkerOptions>();

  public bounds: google.maps.LatLngBounds;
  public validMarkersOptions: MapMarkerOptions[];
  public hasMarkers = false;
  protected readonly clusterRenderer: Renderer =
    new ClusterRenderer() as unknown as Renderer;
  protected readonly clusterAlgorithm: Algorithm =
    new WeightedSuperClusterAlgorithm() as unknown as Algorithm;
  private _map: GoogleMap;

  protected readonly focusedMarker = signal<MapMarkerOptions | null>(null);
  protected readonly infoOptions = computed<google.maps.InfoWindowOptions>(
    () => {
      return {
        headerContent: this.focusedMarker()?.title ?? "",
      };
    },
  );

  protected readonly MapLoadState = GoogleMapsState;
  protected readonly mapsLoadState = signal<GoogleMapsState>(
    this.MapLoadState.Loading,
  );

  protected readonly groups = computed<MarkerGroup[]>(() => {
    const groupSet = new Set<MarkerGroup>();
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

  private readonly info = viewChild(MapInfoWindow);

  /**
   * A content template that is used to render the marker.
   */
  public readonly markerTemplate =
    contentChild<TemplateRef<MarkerTemplate>>("markerTemplate");

  /**
   * A content template that is used to show additional information above the
   * marker when hovered.
   * This appears an info window/tooltip when the marker is hovered.
   */
  public readonly markerHoverTemplate = contentChild<
    TemplateRef<MarkerTemplate>
  >("markerHoverTemplate");

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
    this.applyClusterWeight(options, marker);
    marker.advancedMarker.addEventListener("pointerover", () => {
      this.addMapMarkerInfo(options, marker);
    });

    marker.advancedMarker.addEventListener("click", () => {
      this.handleMarkerClick(options);
    });

    this.focusMarkers();
  }

  private applyClusterWeight(
    options: MapMarkerOptions,
    marker: MapAdvancedMarker,
  ): void {
    const weight = options.clusterWeight ?? 1;
    const advancedMarker = marker.advancedMarker as WeightedAdvancedMarkerElement;

    if (advancedMarker) {
      advancedMarker.clusterWeight = weight;
    }
  }

  protected addMapMarkerInfo(
    options: MapMarkerOptions,
    marker: MapAnchorPoint,
  ): void {
    this.focusedMarker.set(options);
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

  protected handleMarkerClick(marker: MapMarkerOptions): void {
    this.markerClicked.emit(marker);
  }

  // TODO: Implement some sort of caching so that markers of the same group can
  // share the same element reference instead of creating a new one each time.
  protected markerContent(marker: MapMarkerOptions): HTMLElement {
    const customTemplate = this.markerTemplate()?.elementRef?.nativeElement;
    if (customTemplate) {
      const container = this.viewContainer.createEmbeddedView(
        this.markerTemplate(),
        { marker },
      );
      return container.rootNodes[0] as HTMLElement;
    }

    // If the consumer has not provided a custom template in the default slot,
    // we render a pin element with a color based on the marker's group.
    return this.createPinElement(marker);
  }

  private createPinElement(marker: MapMarkerOptions): HTMLElement {
    const color = this.markerColor(marker);
    const pinElement = new google.maps.marker.PinElement({
      background: color,
      borderColor: color,
      glyphColor: "white",
    });

    return pinElement.element;
  }

  /**
   * Takes a marker and returns a color based on its groupId.
   * If there are no groups, or the groupId is not found, the marker will
   * default to red.
   */
  private markerColor(marker: MapMarkerOptions): string {
    const count = this.groups().length;
    const index = this.groups().indexOf(marker.groupId);
    if (index === -1 || count === 0) {
      return "hsl(0, 100%, 50%)"; // Red
    }

    // Using the total number of groups, we evenly pick spaces along the color
    // range [0,1] to get distinct colors.
    // By using a cyclical color scheme instead of a linear one, we hope that
    // colors will be as distinct as possible.
    // https://d3js.org/d3-scale-chromatic/cyclical
    //
    // Note that the count will always be the maximum index + 1.
    // I purposely did this because a value of 0 and 1 are almost identical
    // colors, so by using the count we add even padding to the beginning and
    // the end of the picked color index.
    // E.g. For 2 groups, the indexes will be 0 and 0.5 instead of 0 and 1,
    // ensuring that the two colors are as far apart as possible.
    const scalar = ((1 / count) * index) % 1;
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
