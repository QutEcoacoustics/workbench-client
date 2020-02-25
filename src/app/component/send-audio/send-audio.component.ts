import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { environment } from "src/environments/environment";
import { sendAudioCategory, sendAudioMenuItem } from "./send-audio.menus";

@Page({
  category: sendAudioCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: sendAudioMenuItem
})
@Component({
  selector: "app-send-audio",
  template: `
    <app-wip>
      <app-cms [page]="page"></app-cms>
    </app-wip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendAudioComponent extends PageComponent implements OnInit {
  public page: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.page = environment.values.cms.sendAudio;
  }
}
