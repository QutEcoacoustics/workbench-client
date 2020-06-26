import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
// import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Site } from "src/app/models/Site";

/**
 * Google Maps Wrapper Component
 */
@Component({
  selector: "baw-map",
  template: `
    <!-- <ng-container *ngIf="hasMarkers; else placeholderMap">
      <div class="map-container">
        <google-map height="100%" width="100%" [options]="options">
          <map-marker
            #markerElem
            *ngFor="let marker of markers"
            [position]="marker.position"
            [label]="marker.label"
            (mapClick)="openInfo(markerElem, marker.info)"
          >
          </map-marker>

          <map-info-window>{{ infoContent }}</map-info-window>
        </google-map>
      </div>
    </ng-container>
    <ng-template #placeholderMap> -->
    <div class="map-placeholder"><span>No locations specified</span></div>
    <!-- </ng-template> -->
  `,
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnChanges {
  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  @Input() sites: Site[];
  public markers: any[];
  public options: any = {
    mapTypeId: "satellite",
  };
  public hasMarkers = false;
  public infoContent = "";

  constructor() {}

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    // this.markers = createMarkers(this.sites);
    // this.hasMarkers = this.markers.length > 0;
  }

  // public openInfo(marker: MapMarker, content: string) {
  //   this.infoContent = content;
  //   this.info.open(marker);
  // }
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
    if (!!site.customLatitude && !!site.customLongitude) {
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
