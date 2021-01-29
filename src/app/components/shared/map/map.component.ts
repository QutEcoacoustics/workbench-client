import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

/**
 * Google Maps Wrapper Component
 * ! Manually test when editing, unit test coverage is limited
 */
@Component({
  selector: "baw-map",
  template: `
    <!-- Display Maps -->
    <ng-container *ngIf="hasMarkers && mapLoaded">
      <google-map height="100%" width="100%" [options]="mapOptions">
        <map-marker
          *ngFor="let marker of validMarkers"
          [options]="markerOptions"
          [position]="marker.position"
        >
        </map-marker>
        <map-info-window>{{ infoContent }}</map-info-window>
      </google-map>
    </ng-container>

    <!-- Map Failure -->
    <ng-container *ngIf="hasMarkers && mapFailure">
      <div id="failure" class="map-placeholder">
        <p>Failure to load map</p>
      </div>
    </ng-container>

    <!-- Map Loading -->
    <ng-container *ngIf="hasMarkers && !mapFailure && !mapLoaded">
      <div id="loading" class="map-placeholder">
        <baw-loading></baw-loading>
      </div>
    </ng-container>

    <!-- No Map Markers -->
    <ng-container *ngIf="!hasMarkers">
      <div id="placeholder" class="map-placeholder">
        <p>No locations specified</p>
      </div>
    </ng-container>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent extends withUnsubscribe() implements OnChanges {
  @ViewChild(GoogleMap, { static: false }) public map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) public info: MapInfoWindow;
  @ViewChildren(MapMarker) public mapMarkers: QueryList<MapMarker>;

  @Input() public markers: List<MapMarkerOption>;
  public mapLoaded: boolean;
  public mapFailure: boolean;
  public validMarkers: List<MapMarkerOption>;
  public hasMarkers = false;
  public infoContent = "";

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions: google.maps.MapOptions = { mapTypeId: "satellite" };
  public markerOptions: google.maps.MarkerOptions = {};

  public constructor(
    public mapService: MapService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.markers.isFirstChange()) {
      this.mapService.isMapLoaded$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((state) => {
          if (state === MapService.mapState.success) {
            this.mapLoaded = true;
            this.ref.detectChanges();
            this.setMarkers();
          } else if (state === MapService.mapState.failure) {
            this.mapFailure = true;
          }
        });
    }

    this.validMarkers = (this.markers ??= List([])).filter((marker) =>
      this.mapService.isMarkerValid(marker)
    );
    this.hasMarkers = this.validMarkers.count() > 0;

    if (!this.hasMarkers) {
      return;
    }

    if (this.mapLoaded) {
      this.setMarkers();
    }
  }

  private setMarkers() {
    // Detect changes required so map loads before referencing google namespace
    // and map component
    this.ref.detectChanges();

    // Calculate pin boundaries so that map can be auto-focused properly
    const bounds = new google.maps.LatLngBounds();
    this.validMarkers.forEach((marker) => bounds.extend(marker.position));

    // Create map markers
    this.map?.fitBounds(bounds);
    this.map?.panToBounds(bounds);
    // Setup info windows for each marker
    this.mapMarkers?.forEach((marker, index) => {
      marker.mapMouseover.pipe(takeUntil(this.unsubscribe)).subscribe(
        () => {
          this.infoContent = this.validMarkers.get(index).label as string;
          this.info.open(marker);
        },
        () => console.error("Failed to create info content for map marker")
      );
    });
  }
}
