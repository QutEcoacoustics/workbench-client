import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Site } from "src/app/models/Site";

/**
 * Google Maps Wrapper Component
 * ! Manually test when editing. No unit tests written
 */
@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
      <google-map height="400px" width="100%" [options]="mapOptions">
        <map-marker
          #pin
          *ngFor="let marker of markers"
          [options]="markerOptions"
          [position]="marker.position"
          (mapMouseover)="openInfo(pin, marker.info)"
        >
        </map-marker>
        <map-info-window>{{ infoContent }}</map-info-window>
      </google-map>
    </ng-container>
    <ng-template #placeholderMap>
      <div class="map-placeholder"><span>No locations specified</span></div>
    </ng-template>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnChanges {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  @Input() sites: Site[];
  public hasMarkers = false;
  public infoContent = "";
  public markers: (MapMarker & { info: string })[] = [];

  // Setting to "hybrid" can increase load times and looks like the map is bugged
  public mapOptions = { mapTypeId: "satellite" };
  public markerOptions = { draggable: false };

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.markers = createMarkers(this.sites);
    this.hasMarkers = this.markers.length > 0;
    this.ref.detectChanges();

    // Calculate pin boundaries so that map can be auto-focused properly
    if (this.hasMarkers) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => {
        const position = new google.maps.LatLng(
          this.getCoordinate(marker.position.lat),
          this.getCoordinate(marker.position.lng)
        );
        bounds.extend(position);
      });
      this.map.fitBounds(bounds);
      this.map.panToBounds(bounds);
    }
  }

  /**
   * Open info window for map marker
   * @param marker Map marker
   * @param content Content to display
   */
  public openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
  }

  private getCoordinate(coordinate: number | (() => number)): number {
    return typeof coordinate === "function" ? coordinate() : coordinate;
  }
}

/**
 * Create list of markers for map
 * @param sites List of sites
 * @returns List of markers
 */
export function createMarkers(sites: Site[]): (MapMarker & { info: string })[] {
  if (!sites) {
    return [];
  }

  const markers = [];
  for (const site of sites) {
    if (
      typeof site.customLatitude === "number" &&
      typeof site.customLongitude === "number"
    ) {
      markers.push({
        position: {
          lat: site.customLatitude,
          lng: site.customLongitude,
        },
        label: { text: site.name },
        info: site.name,
      });
    }
  }

  return markers;
}
