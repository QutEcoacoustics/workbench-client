import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  pointHarvestMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import {
  siteHarvestMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";
import {
  pointMenuItemActions,
  siteMenuItemActions,
} from "../details/details.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Site Harvest Component
 */
@Component({
  selector: "baw-sites-harvest",
  templateUrl: "./harvest.component.html",
})
class SiteHarvestComponent extends PageComponent implements OnInit {
  public project: Project;
  public region: Region;
  public site: Site;
  public user: User;

  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    protected api: SitesService,
    private state: BawApiStateService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    if (hasResolvedSuccessfully(models)) {
      this.project = models[projectKey] as Project;
      this.region = models[regionKey] as Region;
      this.site = models[siteKey] as Site;
      this.user = this.state.loggedInUser;
    }
  }

  public getHarvestFileRoute() {
    return this.api.harvestFile(this.site, this.project);
  }
}

SiteHarvestComponent.linkToRoute({
  category: sitesCategory,
  pageRoute: siteHarvestMenuItem,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).linkToRoute({
  category: pointsCategory,
  pageRoute: pointHarvestMenuItem,
  menus: {
    actions: List([pointMenuItem, ...pointMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
});

export { SiteHarvestComponent };
