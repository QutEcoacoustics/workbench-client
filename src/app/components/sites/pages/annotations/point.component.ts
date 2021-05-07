import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  pointAnnotationsMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Region } from "@models/Region";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";
import { SiteAnnotationsComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-point-annotations",
  templateUrl: "annotations.component.html",
})
class PointAnnotationsComponent
  extends SiteAnnotationsComponent
  implements OnInit {
  public ngOnInit(): void {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    this.region = this.models[regionKey] as Region;
  }

  public getAnnotationsPath(): string {
    return this.siteApi.downloadAnnotations(
      this.site,
      this.region.projectId,
      this.model.timezone
    );
  }
}

PointAnnotationsComponent.linkComponentToPageInfo({
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
}).andMenuRoute(pointAnnotationsMenuItem);

export { PointAnnotationsComponent };
