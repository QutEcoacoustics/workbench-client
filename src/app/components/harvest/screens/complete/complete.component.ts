import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { Statistic } from "@components/harvest/components/shared/statistics.component";
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

  public getStatistics(report: HarvestReport): Statistic[][] {
    return [
      [
        {
          bgColor: "success",
          icon: ["fas", "folder-tree"],
          label: "Total Files",
          value: report.itemsTotal.toLocaleString(),
        },
      ],
      [
        {
          bgColor: "success",
          icon: ["fas", "hard-drive"],
          label: "Total Size",
          value: report.itemsSize,
          tooltip: report.itemsSizeBytes.toLocaleString() + " bytes",
        },
      ],
      [
        {
          bgColor: "success",
          icon: ["fas", "clock"],
          label: "Total Duration",
          value: toRelative(report.itemsDuration, {
            largest: 1,
            maxDecimalPoint: 0,
          }),
          tooltip: report.itemsDurationSeconds.toLocaleString() + " seconds",
        },
      ],
      [
        {
          color: "light",
          bgColor: "danger",
          icon: ["fas", "xmark"],
          label: "Failures",
          value: (report.itemsErrored + report.itemsFailed).toLocaleString(),
        },
      ],
    ];
  }

  public getDownloadStatistic(): Statistic {
    return {
      bgColor: "highlight",
      icon: ["fas", "download"],
      value: "",
      label: "",
    };
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