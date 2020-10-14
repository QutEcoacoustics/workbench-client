import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";
import { siteHarvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/site.component";

/**
 * Site Harvest Component
 */
@Component({
  selector: "baw-sites-harvest",
  templateUrl: "./harvest.component.html",
})
class SiteHarvestComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    // TODO
    // this.page = this.env.getCms("harvest");
  }
}

SiteHarvestComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: { actions: List(siteMenuItemActions) },
}).AndMenuRoute(siteHarvestMenuItem);

export { SiteHarvestComponent };
