import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { List } from "immutable";
import { siteHarvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/site.component";

const siteKey = "site";

/**
 * Site Harvest Component
 */
@Component({
  selector: "baw-sites-harvest",
  templateUrl: "./harvest.component.html",
})
class SiteHarvestComponent extends PageComponent implements OnInit {
  public site: Site;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    const resolvers = retrieveResolvers(this.route.data);
    if (resolvers) {
      this.site = resolvers[siteKey] as Site;
    }
  }
}

SiteHarvestComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: { actions: List(siteMenuItemActions) },
  resolvers: { [siteKey]: siteResolvers.show },
}).AndMenuRoute(siteHarvestMenuItem);

export { SiteHarvestComponent };
