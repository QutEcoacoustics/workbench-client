import { Component, Input } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "baw-download-table",
  templateUrl: "./download-table.component.html",
})
export class DownloadTableComponent {
  @Input() public filters$: BehaviorSubject<Filters<AudioRecording>>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;

  public constructor(private recordingsApi: AudioRecordingsService) {}

  public getModels = (filters: Filters<AudioRecording>) =>
    this.recordingsApi.filter(filters);

  public asRecording(model: any): AudioRecording {
    return model;
  }
}
