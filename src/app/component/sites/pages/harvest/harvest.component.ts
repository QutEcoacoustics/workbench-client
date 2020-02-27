import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { DeploymentEnvironmentService } from "src/app/services/environment/deployment-environment.service";
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

  constructor(private env: DeploymentEnvironmentService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.getValues().cms.harvest;
  }
}
