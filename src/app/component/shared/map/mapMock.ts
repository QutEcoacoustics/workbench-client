import { Component, Input, OnInit } from "@angular/core";
import { Site } from "src/app/models/Site";
import { createMap } from "./map.component";

@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="locationPins; else placeholderMap">
      <div class="map-container">
        <ng-container *ngFor="let site of sites">
          <p>Lat: {{ site.customLatitude }} Long: {{ site.customLongitude }}</p>
        </ng-container>
      </div>
    </ng-container>
    <ng-template #placeholderMap>
      <div class="map-placeholder"><span>No locations specified</span></div>
    </ng-template>
  `,
  styleUrls: ["./map.component.scss"],
})
export class MockMapComponent implements OnInit {
  @Input() sites: Site[];
  locationPins = false;

  constructor() {}

  ngOnInit() {
    this.locationPins = createMap(this.sites);
  }
}
