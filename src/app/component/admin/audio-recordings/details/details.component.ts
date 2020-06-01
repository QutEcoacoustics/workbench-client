import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AudioRecording } from "@models/AudioRecording";
import { List } from "immutable";
import { fields } from "../audio-recording.schema.json";
import {
  adminAudioRecordingMenuItem,
  adminAudioRecordingsCategory,
  adminAudioRecordingsMenuItem,
} from "../audio-recordings.menus";

const audioRecordingKey = "audioRecording";

@Page({
  category: adminAudioRecordingsCategory,
  menus: {
    links: List(),
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem]),
  },
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show,
  },
  self: adminAudioRecordingMenuItem,
})
@Component({
  selector: "app-admin-audio-recording",
  template: `
    <div *ngIf="!failure">
      <h1>Audio Recording Details</h1>
      <baw-detail-view
        [fields]="fields"
        [model]="audioRecording"
      ></baw-detail-view>
    </div>
  `,
})
export class AdminAudioRecordingComponent extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public audioRecording: AudioRecording;
  public failure: boolean;
  public fields = fields;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data);

    if (!models) {
      this.failure = true;
      return;
    }

    this.audioRecording = models[audioRecordingKey] as AudioRecording;
  }
}
