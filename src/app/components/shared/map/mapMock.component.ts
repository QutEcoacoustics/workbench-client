import { Component, Input, OnInit } from "@angular/core";
import { List } from "immutable";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers } from "./map.component";

@Component({
  selector: "baw-map",
  template: `
    @if (hasMarkers) {
      <div class="map-container">
        @for (marker of markers; track marker) {
          <p>Lat: {{ marker.position.lat }} Long: {{ marker.position.lng }}</p>
        }
      </div>
    } @else {
      <div class="map-placeholder"><span>No locations specified</span></div>
    }
  `,
  styleUrls: ["./map.component.scss"],
})
export class MockMapComponent implements OnInit {
  @Input() public markers: List<MapMarkerOptions>;
  public hasMarkers = false;

  public constructor() {}

  public ngOnInit() {
    this.hasMarkers = sanitizeMapMarkers(this.markers.toArray())?.size > 0;
  }
}
