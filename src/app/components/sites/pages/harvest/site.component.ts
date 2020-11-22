import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SecurityService } from "@baw-api/security/security.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SessionUser } from "@models/User";
import { List } from "immutable";
import { siteHarvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/site.component";

const projectKey = "project";
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
  public user: SessionUser;

  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    private route: ActivatedRoute,
    private api: SecurityService
  ) {
    super();
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (models) {
      this.project = models[projectKey] as Project;
      this.site = models[siteKey] as Site;
      this.user = this.api.getLocalUser();
    }
  }

  public getHarvestFileRoute() {
    return "not_implemented";
  }
}

SiteHarvestComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: { actions: List(siteMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(siteHarvestMenuItem);

export { SiteHarvestComponent };
