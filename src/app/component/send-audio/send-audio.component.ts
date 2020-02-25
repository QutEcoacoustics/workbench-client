import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from "@angular/core";
import { List } from "immutable";
import { CMS, CMS_DATA } from "src/app/helpers/app-initializer/app-initializer";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
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

  constructor(@Inject(CMS_DATA) private cms: CMS) {
    super();
  }

  ngOnInit() {
    this.page = this.cms.sendAudio;
  }
}
