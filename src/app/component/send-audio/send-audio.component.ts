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
  templateUrl: "./send-audio.component.html",
  styleUrls: ["./send-audio.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendAudioComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
