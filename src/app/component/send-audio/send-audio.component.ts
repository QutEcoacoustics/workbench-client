import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { List } from "immutable";
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
    <app-cms page="sendAudio.html"></app-cms>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendAudioComponent {}
