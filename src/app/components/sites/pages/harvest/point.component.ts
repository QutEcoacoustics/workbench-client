import { Component } from "@angular/core";
import {
  pointHarvestMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";
import { SiteHarvestComponent } from "./site.component";

/**
 * Site Harvest Component
 */
@Component({
  selector: "app-sites-harvest",
  templateUrl: "./harvest.component.html",
})
class PointHarvestComponent extends SiteHarvestComponent {}

PointHarvestComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: { actions: List(pointMenuItemActions) },
}).AndMenuRoute(pointHarvestMenuItem);

export { PointHarvestComponent };
