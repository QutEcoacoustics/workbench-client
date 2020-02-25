import { Component, Inject, OnInit } from "@angular/core";
import { List } from "immutable";
import { CMS, CMS_DATA } from "src/app/helpers/app-initializer/app-initializer";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { harvestMenuItem, sitesCategory } from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";

@Page({
  category: sitesCategory,
  menus: {
    actions: List(siteMenuItemActions),
    links: List()
  },
  self: harvestMenuItem
})
@Component({
  selector: "app-sites-harvest",
  template: `
    <app-wip>
      <app-cms [page]="page"></app-cms>
    </app-wip>
  `
})
export class HarvestComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(@Inject(CMS_DATA) private cms: CMS) {
    super();
  }

  ngOnInit() {
    this.page = this.cms.harvest;
  }
}
