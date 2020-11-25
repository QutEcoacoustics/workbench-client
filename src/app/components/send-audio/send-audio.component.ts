import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { sendAudioCategory, sendAudioMenuItem } from "./send-audio.menus";

@Component({
  selector: "baw-send-audio",
  template: '<baw-cms [page]="page"></baw-cms>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SendAudioComponent extends PageComponent {
  public page = CMS.dataUpload;
}

SendAudioComponent.linkComponentToPageInfo({
  category: sendAudioCategory,
}).andMenuRoute(sendAudioMenuItem);

export { SendAudioComponent };
