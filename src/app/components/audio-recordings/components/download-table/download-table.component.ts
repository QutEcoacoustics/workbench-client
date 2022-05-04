import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { Column } from "@directives/datatable/pagination.directive";
import { toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";

type RecordingFilters = Filters<AudioRecording>;

@Component({
  selector: "baw-download-table",
  templateUrl: "./download-table.component.html",
})
export class DownloadTableComponent implements OnInit {
  @Input() public filters$: Observable<RecordingFilters>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public columns: Column<AudioRecording>[] = [
    { key: "id", name: "Id" },
    { key: "siteId", name: "Site" },
    { key: "recordedDate", name: "Recorded" },
    { key: "durationSeconds", name: "Duration" },
    { key: "mediaType", name: "Media Type" },
    { key: "originalFileName", name: "Original File Name" },
  ];

  public constructor(private recordingsApi: AudioRecordingsService) {}

  public ngOnInit(): void {}

  public getModels = (filters: Filters<AudioRecording>) =>
    this.recordingsApi.filter(filters);

  public asRecording(model: any): AudioRecording {
    return model;
  }

  public formatDuration(duration: Duration): string {
    return toRelative(duration, {
      largest: 2,
      round: true,
    });
  }

  public formatDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd hh:mm:ss");
  }
}
