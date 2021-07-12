import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import { regionMenuItem } from "@components/regions/regions.menus";
import {
  newPointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import schema from "../../point.base.json";
import { SiteNewComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";

@Component({
  selector: "baw-points-new",
  templateUrl: "./new.component.html",
})
class PointNewComponent extends SiteNewComponent {
  public fields = schema.fields;
  public title = "New Point";

  public constructor(
    api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(api, notifications, route, router);
  }

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

PointNewComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: { actions: List([regionMenuItem, ...regionMenuItemActions]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).andMenuRoute(newPointMenuItem);

export { PointNewComponent };
