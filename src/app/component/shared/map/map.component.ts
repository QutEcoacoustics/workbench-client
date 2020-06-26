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
 */
@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
      <google-map height="400px" width="100%">
        <map-marker
          #marker
          *ngFor="let marker of markers"
          [options]="markerOptions"
          [position]="marker.position"
          [label]="marker.label"
          (mapClick)="openInfo(marker, marker.info)"
        ></map-marker>
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
  public markers = [];
  public hasMarkers = false;
  public infoContent = "";
  public mapOptions = { mapTypeId: "satellite" };
  public markerOptions = { draggable: false };

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.markers = createMarkers(this.sites);
    this.hasMarkers = this.markers.length > 0;

    if (this.hasMarkers) {
      this.ref.detectChanges();
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => {
        bounds.extend(
          new google.maps.LatLng(marker.position.lat, marker.position.lng)
        );
      });
      this.map.fitBounds(bounds);
      this.map.panToBounds(bounds);
    }
  }

  public openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
  }
}

/**
 * Create list of markers for map
 * @param sites List of sites
 * @returns List of markers
 */
export function createMarkers(sites: Site[]): any[] {
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
        label: {
          text: site.name,
        },
        info: site.name + ": " + site.description,
      });
    }
  }

  return markers;
}
