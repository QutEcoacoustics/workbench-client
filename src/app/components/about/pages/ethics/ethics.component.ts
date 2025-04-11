import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { aboutCategory, ethicsMenuItem } from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { CmsComponent } from "../../../shared/cms/cms.component";

@Component({
  selector: "baw-about-ethics",
  template: '<baw-cms [page]="page"></baw-cms>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CmsComponent],
})
class EthicsComponent extends PageComponent {
  public page = CMS.ethics;
}

EthicsComponent.linkToRoute({
  category: aboutCategory,
  pageRoute: ethicsMenuItem,
});

export { EthicsComponent };
