import { Component, Input } from "@angular/core";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { List } from "immutable";

@Component({
  selector: "app-region-cards",
  templateUrl: "./region-cards.component.html",
  styleUrls: ["./region-cards.component.scss"],
})
export class RegionCardsComponent {
  @Input() public project: Project;
  @Input() public regions: List<Region>;
  @Input() public showMap: boolean;

  public numSites(region: Region) {
    return region.siteIds?.size || 0;
  }
}
