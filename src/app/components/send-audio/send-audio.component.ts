import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { CmsComponent } from "../shared/cms/cms.component";
import { sendAudioCategory, sendAudioMenuItem } from "./send-audio.menus";

@Component({
  selector: "baw-send-audio",
  template: '<baw-cms [page]="page"></baw-cms>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CmsComponent],
})
class SendAudioComponent extends PageComponent {
  public page = CMS.dataUpload;
}

SendAudioComponent.linkToRoute({
  category: sendAudioCategory,
  pageRoute: sendAudioMenuItem,
});

export { SendAudioComponent };
