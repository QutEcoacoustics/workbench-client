import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Site } from "src/app/models/Site";

@Component({
  selector: "app-map",
  template: `
    <ng-container *ngIf="locationPins; else placeholderMap">
      <div class="map-container">
        <agm-map [fitBounds]="true">
          <ng-container *ngFor="let site of sites">
            <agm-marker
              *ngIf="site.customLongitude && site.customLatitude"
              [latitude]="site.customLatitude"
              [longitude]="site.customLongitude"
              [agmFitBounds]="true"
            >
              <agm-snazzy-info-window
                [isOpen]="true"
                [padding]="'10px 25px 10px 10px'"
                [borderRadius]="'10px'"
              >
                <ng-template>{{ site.name }}</ng-template>
              </agm-snazzy-info-window>
            </agm-marker>
          </ng-container>
        </agm-map>
      </div>
    </ng-container>
    <ng-template #placeholderMap>
      <div class="map-placeholder"><span>No locations specified</span></div>
    </ng-template>
  `,
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit, OnChanges {
  @Input() sites: Site[];
  locationPins = false;

  constructor() {}

  ngOnInit() {
    this.locationPins = createMap(this.sites);
  }

  ngOnChanges() {
    this.locationPins = createMap(this.sites);
  }
}

/**
 * Determine whether google maps should be shown. This searches the list of sites
 * and determines if any have a custom latitude and longitude.
 * @param sites List of sites
 * @returns True if google map should be created
 */
export function createMap(sites: Site[]): boolean {
  if (!sites) {
    return false;
  }

  for (const site of sites) {
    if (
      typeof site.customLatitude === "number" &&
      typeof site.customLongitude === "number"
    ) {
      return true;
    }
  }

  return false;
}
