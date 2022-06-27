import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { HarvestReport } from "@models/Harvest";
import { Project } from "@models/Project";
import { DateTime, Duration } from "luxon";

@Component({
  selector: "baw-harvest-complete",
  templateUrl: "complete.component.html",
  styleUrls: ["complete.component.scss"],
})
export class CompleteComponent implements OnInit {
  public audioRecordingsRoute = audioRecordingsRoutes.project;

  public constructor(
    public stages: HarvestStagesService,
    private recordingsApi: AudioRecordingsService
  ) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public getModels = (filters: Filters<AudioRecording>) =>
    this.recordingsApi.filterByHarvest(filters, this.stages.harvest);

  public asRecording(model: any): AudioRecording {
    return model;
  }

  public get report(): HarvestReport {
    return this.stages.harvest.report;
  }

  public get project(): Project {
    return this.stages.project;
  }

  public humanizeDuration(duration: Duration): string {
    return toRelative(duration, { largest: 1, maxDecimalPoint: 0 });
  }

  public humanizeDurationLong(duration: Duration): string {
    return toRelative(duration, {
      largest: 2,
      round: true,
    });
  }

  public formatDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd HH:mm:ss");
  }
}
