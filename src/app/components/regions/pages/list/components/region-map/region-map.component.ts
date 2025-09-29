import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";

@Component({
  selector: "baw-region-map",
  templateUrl: "./region-map.component.html",
  styleUrl: "./region-map.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteMapComponent],
})
export class RegionMapComponent { }
