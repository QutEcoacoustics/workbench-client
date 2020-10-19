import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, toRelative } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { List } from "immutable";
import {
  adminAudioRecordingMenuItem,
  adminAudioRecordingsCategory,
  adminAudioRecordingsMenuItem,
} from "../audio-recordings.menus";

@Component({
  selector: "baw-admin-audio-recordings",
  templateUrl: "./list.component.html",
})
class AdminAudioRecordingsComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit {
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

  constructor(api: AudioRecordingsService) {
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

  /**
   * Path to view audio recording details
   * @param model Audio Recording
   */
  public detailsPath(model: AudioRecording) {
    return adminAudioRecordingMenuItem.route.format({
      audioRecordingId: model.id,
    });
  }
}

AdminAudioRecordingsComponent.LinkComponentToPageInfo({
  category: adminAudioRecordingsCategory,
  menus: { actions: List([adminDashboardMenuItem, ...adminMenuItemActions]) },
}).AndMenuRoute(adminAudioRecordingsMenuItem);

export { AdminAudioRecordingsComponent };

interface TableRow {
  id: Id;
  site: Id;
  duration: string;
  recorded: string;
  model: AudioRecording;
}
