import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  editPointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { fields } from "../../point.base.json";
import { pointMenuItemActions } from "../details/point.component";
import { SiteEditComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "app-points-edit",
  templateUrl: "./edit.component.html",
})
class PointEditComponent extends SiteEditComponent {
  public fields = fields;
}

PointEditComponent.LinkComponentToPageInfo({
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
}).AndMenuRoute(editPointMenuItem);

export { PointEditComponent };
