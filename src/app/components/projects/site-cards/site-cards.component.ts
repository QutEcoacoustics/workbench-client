import { Component, Input } from "@angular/core";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { List } from "immutable";

@Component({
  selector: "app-site-cards",
  templateUrl: "./site-cards.component.html",
  styleUrls: ["./site-cards.component.scss"],
})
export class SiteCardsComponent {
  @Input() public project: Project;
  @Input() public sites: List<Site>;
  @Input() public showMap: boolean;
  @Input() public isRegion: boolean;
}
