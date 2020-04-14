import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
  aboutCategory,
  disclaimersMenuItem,
} from "@component/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";

@Page({
  category: aboutCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: disclaimersMenuItem,
})
@Component({
  selector: "app-about-disclaimers",
  template: ` <app-cms [page]="page"></app-cms> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimersComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.values.cms.disclaimers;
  }
}
