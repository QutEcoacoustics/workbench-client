import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  pointAnnotationsMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";
import { SiteAnnotationsComponent } from "./site.component";

const projectKey = "project";
const siteKey = "site";

@Component({
  selector: "baw-point-annotations",
  templateUrl: "annotations.component.html",
})
class PointAnnotationsComponent extends SiteAnnotationsComponent {
  public isSite = false;
}

PointAnnotationsComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(pointAnnotationsMenuItem);

export { PointAnnotationsComponent };
