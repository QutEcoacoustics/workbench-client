import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
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

@Component({
  selector: "baw-admin-audio-recording",
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
class AdminAudioRecordingComponent
  extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public audioRecording: AudioRecording;
  public failure: boolean;
  public fields = fields;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);

    if (!models) {
      this.failure = true;
      return;
    }

    this.audioRecording = models[audioRecordingKey] as AudioRecording;
  }
}

AdminAudioRecordingComponent.LinkComponentToPageInfo({
  category: adminAudioRecordingsCategory,
  menus: {
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem]),
  },
  resolvers: { [audioRecordingKey]: audioRecordingResolvers.show },
}).AndMenuRoute(adminAudioRecordingMenuItem);

export { AdminAudioRecordingComponent };
