import { Component, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowHarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { Statistic } from "@components/harvest/components/shared/statistics/statistics.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import { toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { HarvestReport } from "@models/Harvest";
import { Project } from "@models/Project";

@Component({
  selector: "baw-harvest-complete",
  templateUrl: "complete.component.html",
  styleUrls: ["complete.component.scss"],
})
export class CompleteComponent implements OnInit {
  public projectMenuItem = projectMenuItem;
  public audioRecordingsRoute = audioRecordingsRoutes.project;

  public constructor(
    public stages: HarvestStagesService,
    private harvestItemsApi: ShallowHarvestItemsService,
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

  public get recordingsReportUrl(): string {
    return this.recordingsApi.harvestCsvReportUrl(this.stages.harvest);
  }

  public get harvestItemsReportUrl(): string {
    return this.harvestItemsApi.harvestCsvReportUrl(this.stages.harvest);
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

  public get downloadIcon(): Statistic {
    return {
      bgColor: "highlight",
      icon: ["fas", "download"],
      value: "",
      label: "",
    };
  }
}
