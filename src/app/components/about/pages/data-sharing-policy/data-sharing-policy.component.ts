import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import {
  aboutCategory,
  dataSharingPolicyMenuItem,
} from "@components/about/about.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { CmsComponent } from "@shared/cms/cms.component";

@Component({
  selector: "baw-about-data-sharing-policy",
  template: "<baw-cms [page]='page'></baw-cms>",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CmsComponent],
})
class DataSharingPolicyComponent extends PageComponent {
  public page = CMS.dataSharingPolicy;
}

DataSharingPolicyComponent.linkToRoute({
  category: aboutCategory,
  pageRoute: dataSharingPolicyMenuItem,
});

export { DataSharingPolicyComponent };
