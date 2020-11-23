import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { aboutCategory, creditsMenuItem } from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-about-credits",
  template: '<baw-cms [page]="page"></baw-cms>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CreditsComponent extends PageComponent {
  public page = CMS.credits;
}

CreditsComponent.linkComponentToPageInfo({
  category: aboutCategory,
}).andMenuRoute(creditsMenuItem);

export { CreditsComponent };
