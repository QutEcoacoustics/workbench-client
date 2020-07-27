import { Component, Input, OnInit } from "@angular/core";
import { sanitizeMapMarkers } from "./map.component";

@Component({
  selector: "baw-map",
  template: `
    <ng-container *ngIf="hasMarkers; else placeholderMap">
      <div class="map-container">
        <ng-container *ngFor="let marker of markers">
          <p>Lat: {{ marker.position.lat }} Long: {{ marker.position.lng }}</p>
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
  @Input() public markers: any;
  public hasMarkers = false;

  constructor() {}

  public ngOnInit() {
    this.hasMarkers = sanitizeMapMarkers(this.markers)?.length > 0;
  }
}
