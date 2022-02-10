import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import schema from "@components/audio-recordings/pages/details/audio-recording.schema.json";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AudioRecording } from "@models/AudioRecording";
import { List } from "immutable";
import {
  adminAudioRecordingMenuItem,
  adminAudioRecordingsCategory,
  adminAudioRecordingsMenuItem,
} from "../audio-recordings.menus";

const audioRecordingKey = "audioRecording";

// TODO This page is now redundant
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
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.audioRecording = models[audioRecordingKey] as AudioRecording;
  }
}

AdminAudioRecordingComponent.linkToRoute({
  category: adminAudioRecordingsCategory,
  pageRoute: adminAudioRecordingMenuItem,
  menus: {
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [audioRecordingKey]: audioRecordingResolvers.show },
});

export { AdminAudioRecordingComponent };
