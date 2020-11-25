import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SecurityService } from "@baw-api/security/security.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  pointHarvestMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SessionUser } from "@models/User";
import { List } from "immutable";
import { pointMenuItemActions } from "../details/point.component";

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
class PointHarvestComponent extends PageComponent implements OnInit {
  public project: Project;
  public region: Region;
  public site: Site;
  public user: SessionUser;

  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    private route: ActivatedRoute,
    private api: SecurityService
  ) {
    super();
  }

  public ngOnInit() {
    const resolvers = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (resolvers) {
      this.project = resolvers[projectKey] as Project;
      this.region = resolvers[regionKey] as Region;
      this.site = resolvers[siteKey] as Site;
      this.user = this.api.getLocalUser();
    }
  }

  public getHarvestFileRoute() {
    return "not_implemented";
  }
}

PointHarvestComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: { actions: List(pointMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(pointHarvestMenuItem);

export { PointHarvestComponent };
