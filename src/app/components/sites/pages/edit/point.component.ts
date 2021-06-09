import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  editPointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../point.base.json";
import { pointMenuItemActions } from "../details/point.component";
import { SiteEditComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-points-edit",
  templateUrl: "./edit.component.html",
})
class PointEditComponent extends SiteEditComponent {
  public fields = fields;

  public constructor(
    api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(api, notifications, route, router);
  }
}

PointEditComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(editPointMenuItem);

export { PointEditComponent };
