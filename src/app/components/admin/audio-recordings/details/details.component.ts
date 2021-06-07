import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
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
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public audioRecording: AudioRecording;
  public failure: boolean;
  public fields = fields;

  public constructor(private route: ActivatedRoute) {
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

AdminAudioRecordingComponent.linkComponentToPageInfo({
  category: adminAudioRecordingsCategory,
  menus: {
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [audioRecordingKey]: audioRecordingResolvers.show },
}).andMenuRoute(adminAudioRecordingMenuItem);

export { AdminAudioRecordingComponent };
