import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { harvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";

/**
 * Site Harvest Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List(siteMenuItemActions),
    links: List(),
  },
  self: harvestMenuItem,
})
@Component({
  selector: "app-sites-harvest",
  template: `
    <baw-wip>
      <baw-cms [page]="page"></baw-cms>
    </baw-wip>
  `,
})
export class HarvestComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.harvest;
  }
}
