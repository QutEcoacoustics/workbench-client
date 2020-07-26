import { Component, Input, OnInit } from "@angular/core";

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
  @Input() public markers: google.maps.ReadonlyMarkerOptions[];
  public hasMarkers = false;

  constructor() {}

  public ngOnInit() {
    this.hasMarkers = this.markers.length > 0;
  }
}
