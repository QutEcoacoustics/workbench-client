import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  pointHarvestMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { PageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SessionUser } from "@models/User";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";
import { SiteHarvestComponent } from "./site.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Site Harvest Component
 */
@Component({
  selector: "baw-points-harvest",
  templateUrl: "./harvest.component.html",
})
class PointHarvestComponent extends SiteHarvestComponent implements OnInit {
  public project: Project;
  public region: Region;
  public site: Site;
  public user: SessionUser;

  public constructor(
    @Inject(API_ROOT) apiRoot: string,
    route: ActivatedRoute,
    api: SitesService
  ) {
    super(apiRoot, route, api);
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (models) {
      this.project = models[projectKey] as Project;
      this.region = models[regionKey] as Region;
      this.site = models[siteKey] as Site;
      this.user = this.api.getLocalUser();
    }
  }
}

PointHarvestComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent)],
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(pointHarvestMenuItem);

export { PointHarvestComponent };
