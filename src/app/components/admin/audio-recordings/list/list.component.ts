import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { List } from "immutable";
import {
  adminAudioRecordingsCategory,
  adminAudioRecordingsMenuItem,
} from "../audio-recordings.menus";

// TODO This page is now redundant
@Component({
  selector: "baw-admin-audio-recordings",
  templateUrl: "./list.component.html",
})
class AdminAudioRecordingsComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit
{
  public columns = [
    { name: "Id" },
    { name: "Site" },
    { name: "Duration" },
    { name: "Recorded" },
    { name: "Model" },
  ];
  public sortKeys = {
    id: "id",
    site: "siteId",
    duration: "durationSeconds",
    recorded: "recordedDate",
  };

  public constructor(api: AudioRecordingsService) {
    super(api, (audioRecordings) =>
      audioRecordings.map((audioRecording) => ({
        id: audioRecording.id,
        site: audioRecording.siteId,
        duration: toRelative(audioRecording.duration, {
          largest: 2,
          maxDecimalPoint: 0,
        }),
        recorded: audioRecording.recordedDate.toRelative(),
        model: audioRecording,
      }))
    );
  }

  public ngOnInit(): void {
    this.getPageData();
  }
}

AdminAudioRecordingsComponent.linkComponentToPageInfo({
  category: adminAudioRecordingsCategory,
  menus: { actions: List([adminDashboardMenuItem, ...adminMenuItemActions]) },
}).andMenuRoute(adminAudioRecordingsMenuItem);

export { AdminAudioRecordingsComponent };

interface TableRow {
  id: Id;
  site: Id;
  duration: string;
  recorded: string;
  model: AudioRecording;
}
