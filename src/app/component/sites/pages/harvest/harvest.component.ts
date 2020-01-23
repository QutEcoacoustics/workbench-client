import { Component } from "@angular/core";
import { List } from "immutable";
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
      <app-cms page="harvest.html"></app-cms>
    </app-wip>
  `
})
export class HarvestComponent extends PageComponent {
  constructor() {
    super();
  }
}
