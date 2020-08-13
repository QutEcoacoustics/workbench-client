import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { harvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";

/**
 * Site Harvest Component
 */
@Component({
  selector: "app-sites-harvest",
  template: `
    <baw-wip>
      <baw-cms [page]="page"></baw-cms>
    </baw-wip>
  `,
})
class HarvestComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.harvest;
  }
}

HarvestComponent.WithInfo({
  category: sitesCategory,
  menus: { actions: List(siteMenuItemActions) },
  self: harvestMenuItem,
});

export { HarvestComponent };
