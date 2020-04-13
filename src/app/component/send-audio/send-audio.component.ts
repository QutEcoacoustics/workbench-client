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
    <app-wip>
      <app-cms [page]="page"></app-cms>
    </app-wip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendAudioComponent extends PageComponent implements OnInit {
  public page: string;

  constructor(private env: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.values.cms.sendAudio;
  }
}
