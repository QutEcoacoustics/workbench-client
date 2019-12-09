import { Component, Input, OnInit } from "@angular/core";
import { Site } from "src/app/models/Site";

@Component({
  selector: "app-map",
  template: `
    <ng-container *ngIf="sites && sites.length > 0; else placeholderMap">
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
export class MapComponent implements OnInit {
  @Input() sites: Site[];

  constructor() {}

  ngOnInit() {}
}
