import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import {
  aboutCategory,
  disclaimersMenuItem,
} from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-about-disclaimers",
  template: '<baw-cms [page]="page"></baw-cms>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DisclaimersComponent extends PageComponent {
  public page = CMS.privacy;
}

DisclaimersComponent.linkComponentToPageInfo({
  category: aboutCategory,
}).andMenuRoute(disclaimersMenuItem);

export { DisclaimersComponent };
