import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  GoogleMapsState,
  MapMarkerOptions,
  MapOptions,
  MapsService,
} from "@services/maps/maps.service";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

/**
 * Google Maps Wrapper Component
 * ! Manually test when editing, unit test coverage is poor
 */
@Component({
  selector: "baw-map",
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss",
})
export class MapComponent
  extends withUnsubscribe()
  implements OnChanges, AfterViewChecked
{
  public constructor(private mapService: MapsService) {
    super();

    this.mapService
      .loadAsync()
      .catch(() => console.warn("Failed to load Google Maps"));
  }

  // TODO: These ViewChild decorators are making the ngAfterViewChecked hook
  // continuously run. We should refactor this component to improve performance
  @ViewChild(GoogleMap) public map?: GoogleMap;
  @ViewChild(MapInfoWindow) public info?: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers?: QueryList<MapMarker>;

  @Input() public markers: List<MapMarkerOptions>;
  @Input() public markerOptions: MapMarkerOptions;
  @Output() public newLocation = new EventEmitter<google.maps.MapMouseEvent>();

  public validMarkers: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: MapOptions = { mapTypeId: "satellite" };
  public bounds: google.maps.LatLngBounds;

  /**
   * By setting this flag, the next change detection cycle will cause the
   * map bounds and marker information to be updated
   */
  private shouldUpdateMapElement: boolean = false;

  public get googleMapsLoaded(): boolean {
    return this.mapService.mapsState === GoogleMapsState.Loaded;
  }

  public get googleMapsFailed(): boolean {
    return this.mapService.mapsState === GoogleMapsState.Failed;
  }

  /**
   * Runs when new markers are added/removed
   * This is possible because the markers are an immutable list
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ("markers" in changes) {
      this.updateFilteredMarkers();
      this.shouldUpdateMapElement = true;
    }
  }

  public ngAfterViewChecked(): void {
    if (!this.map || !this.hasMarkers || !this.shouldUpdateMapElement) {
      return;
    }
    this.shouldUpdateMapElement = false;

    this.focusMapMarkers();
    this.addMarkerInformation();
  }

  /**
   * Extracts valid markers into `validMarkers`
   */
  private updateFilteredMarkers(): void {
    this.hasMarkers = false;
    this.validMarkers = [];

    this.markers?.forEach((marker) => {
      if (isMarkerValid(marker)) {
        this.hasMarkers = true;
        this.validMarkers.push(marker);
      }
    });
  }

  /**
   * Moves the maps viewport to fit all `filteredMarkers` by calculating marker
   * boundaries so that the map has all markers in focus
   */
  private focusMapMarkers(): void {
    this.bounds = new google.maps.LatLngBounds();
    this.validMarkers.forEach((marker) => {
      this.bounds.extend(marker.position);
    });

    this.map.fitBounds(this.bounds);
    this.map.panToBounds(this.bounds);
  }

  /**
   * Adds a map-info-window to each map marker
   * This is done to provide a label for each marker when the user hovers over
   * the marker
   */
  private addMarkerInformation(): void {
    this.mapMarkers?.forEach((marker, index) => {
      marker.mapMouseover.pipe(takeUntil(this.unsubscribe)).subscribe({
        next: () => {
          this.infoContent = this.validMarkers[index].label as string;
          this.info.open(marker);
        },
        error: () => {
          console.error("Failed to create info content for map marker");
        },
      });
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
