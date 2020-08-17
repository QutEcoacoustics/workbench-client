import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
  aboutCategory,
  disclaimersMenuItem,
} from "@component/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AppConfigService } from "@services/app-config/app-config.service";

@Component({
  selector: "app-about-disclaimers",
  template: `<baw-cms [page]="page"></baw-cms>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DisclaimersComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.disclaimers;
  }
}

DisclaimersComponent.LinkComponentToPageInfo({
  category: aboutCategory,
}).AndMenuRoute(disclaimersMenuItem);

export { DisclaimersComponent };
