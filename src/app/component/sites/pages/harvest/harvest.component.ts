import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { environment } from "src/environments/environment";
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

  constructor() {
    super();
  }

  ngOnInit() {
    this.page = environment.values.cms.harvest;
  }
}
