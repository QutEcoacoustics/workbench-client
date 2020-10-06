import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import { regionMenuItem } from "@components/regions/regions.menus";
import {
  newPointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { SiteNewComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";

@Component({
  selector: "app-points-new",
  templateUrl: "./new.component.html",
})
class PointNewComponent extends SiteNewComponent {
  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(
      new Site({ ...model, regionId: this.region.id }),
      this.project
    );
  }
}

PointNewComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: { actions: List([regionMenuItem, ...regionMenuItemActions]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(newPointMenuItem);
export { PointNewComponent };
