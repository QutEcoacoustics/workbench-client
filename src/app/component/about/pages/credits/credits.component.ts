import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { aboutCategory, creditsMenuItem } from "@component/about/about.menus";
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
  self: creditsMenuItem,
})
@Component({
  selector: "app-about-credits",
  template: ` <baw-cms [page]="page"></baw-cms> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditsComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.credits;
  }
}
