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
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { GoogleMapsState, MapsService } from "@services/maps/maps.service";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

export type MapMarkerOptions = google.maps.MarkerOptions;
export type MapOptions = google.maps.MapOptions;

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

    // we use "finally" here so that we will trigger a change detection cycle
    // if Google Maps successfully or unsuccessfully embeds
    this.mapService.loadAsync().finally(() => this.updateMapMarkers());
  }

  @ViewChild(GoogleMap) public map: GoogleMap;
  @ViewChild(MapInfoWindow) public info: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers: QueryList<MapMarker>;

  @Input() public markers: List<MapMarkerOptions>;
  @Input() public markerOptions: MapMarkerOptions;
  @Output() public newLocation = new EventEmitter<google.maps.MapMouseEvent>();

  public filteredMarkers: MapMarkerOptions[];
  public hasMarkers = false;
  public infoContent = "";

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: MapOptions = { mapTypeId: "satellite" };
  public bounds: google.maps.LatLngBounds;
  private updateMap: boolean = false;

  public get googleMapsLoaded(): boolean {
    return this.mapService.mapsState === GoogleMapsState.Loaded;
  }

  public get googleMapsFailed(): boolean {
    return this.mapService.mapsState === GoogleMapsState.Failed;
  }

  public ngOnChanges(): void {
    this.hasMarkers = false;
    this.filteredMarkers = [];

    if (!this.googleMapsLoaded) {
      return;
    }

    this.updateMapMarkers();
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
        next: () => {
          this.infoContent = this.filteredMarkers[index].label as string;
          this.info.open(marker);
        },
        error: () => {
          console.error("Failed to create info content for map marker");
        },
      });
    });
  }

  private updateMapMarkers(): void {
    // Calculate pin boundaries so that map can be auto-focused properly
    this.bounds = new google.maps.LatLngBounds();
    this.markers?.forEach((marker) => {
      if (isMarkerValid(marker)) {
        this.hasMarkers = true;
        this.filteredMarkers.push(marker);
        this.bounds.extend(marker.position);
      }
    });
    this.updateMap = true;
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
