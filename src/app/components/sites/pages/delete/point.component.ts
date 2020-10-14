import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  deletePointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { Region } from "@models/Region";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";
import { SiteDeleteComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-points-delete",
  templateUrl: "./delete.component.html",
})
class PointDeleteComponent extends SiteDeleteComponent {
  public get region(): Region {
    return this.models.region as Region;
  }

  protected redirectionPath() {
    return this.region.viewUrl;
  }
}
PointDeleteComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(deletePointMenuItem);
export { PointDeleteComponent };
