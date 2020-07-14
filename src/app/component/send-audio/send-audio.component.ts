import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";
import { sendAudioCategory, sendAudioMenuItem } from "./send-audio.menus";

@Page({
  category: sendAudioCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: sendAudioMenuItem,
})
@Component({
  selector: "app-send-audio",
  template: `
    <baw-wip>
      <baw-cms [page]="page"></baw-cms>
    </baw-wip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendAudioComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.sendAudio;
  }
}
