import { Component, OnInit } from "@angular/core";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";
import { IHarvestReport } from "@models/Harvest";

@Component({
  selector: "baw-harvest-complete",
  template: `
    <h3>Finished</h3>

    <p>{{ report.itemsCompleted }} files were successfully added!</p>

    <p>
      {{ report.itemsFailed + report.itemsErrored }} files failed to be
      harvested!
    </p>

    <baw-wip>
      <p>
        <a href="/intentionally_broken">
          <fa-icon [icon]="['fas', 'download']"></fa-icon> Download summary of
          harvest
        </a>
      </p>
    </baw-wip>

    <div class="clearfix">
      <a class="btn btn-primary float-end" [strongRoute]="audioRecordingsRoute">
        Show audio files
      </a>
    </div>
  `,
})
export class HarvestCompleteComponent implements OnInit {
  public audioRecordingsRoute = audioRecordingsRoutes.project;

  public constructor(public stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get report(): IHarvestReport {
    return this.stages.harvest.report;
  }
}
