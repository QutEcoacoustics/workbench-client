import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { aboutCategory, ethicsMenuItem } from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";

@Component({
  selector: "app-about-ethics",
  template: ` <baw-cms [page]="page"></baw-cms> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class EthicsComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.ethics;
  }
}

EthicsComponent.LinkComponentToPageInfo({
  category: aboutCategory,
}).AndMenuRoute(ethicsMenuItem);

export { EthicsComponent };
