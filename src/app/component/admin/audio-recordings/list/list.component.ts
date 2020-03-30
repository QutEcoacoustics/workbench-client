import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { AudioRecordingService } from "src/app/services/baw-api/audio-recording.service";
import { adminAudioRecordingsMenuItem, adminCategory } from "../../admin.menus";
import { adminMenuItemActions } from "../../dashboard/dashboard.component";

@Page({
  category: adminCategory,
  menus: {
    links: List(adminMenuItemActions),
    actions: List()
  },
  self: adminAudioRecordingsMenuItem
})
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class AdminAudioRecordingsListComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit {
  constructor(api: AudioRecordingService) {
    super(api, audioRecordings =>
      audioRecordings.map(audioRecording => ({
        id: audioRecording.id,
        site: audioRecording.siteId,
        duration: "unknown",
        recorded: audioRecording.recordedDate.toRelative(),
        annotations: -1,
        model: audioRecording
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Id" },
      { name: "Site" },
      { name: "Duration" },
      { name: "Recorded" },
      { name: "Annotations" },
      { name: "Model" }
    ];
    this.sortKeys = {
      id: "id",
      site: "siteId",
      duration: "durationSeconds",
      recorded: "recordedDate"
    };

    this.getModels();
  }
}

interface TableRow {
  id: Id;
  site: Id;
  duration: string;
  recorded: string;
  annotations: number;
  model: AudioRecording;
}
