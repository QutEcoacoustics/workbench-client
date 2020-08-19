import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { aboutCategory, creditsMenuItem } from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";

@Component({
  selector: "app-about-credits",
  template: ` <baw-cms [page]="page"></baw-cms> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CreditsComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.credits;
  }
}

CreditsComponent.LinkComponentToPageInfo({
  category: aboutCategory,
}).AndMenuRoute(creditsMenuItem);

export { CreditsComponent };
