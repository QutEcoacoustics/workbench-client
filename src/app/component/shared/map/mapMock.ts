import { Component, Input, OnInit } from "@angular/core";
import { Site } from "src/app/models/Site";
import { createMarkers } from "./map.component";

@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
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
  @Input() public sites: Site[];
  public hasMarkers = false;

  constructor() {}

  public ngOnInit() {
    const markers = createMarkers(this.sites);
    this.hasMarkers = markers.length > 0;
  }
}
