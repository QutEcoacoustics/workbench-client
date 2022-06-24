import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { HarvestReport } from "@models/Harvest";

@Component({
  selector: "baw-harvest-processing",
  template: `
    <h3>Saving...</h3>

    <p>We are adding in all those files!</p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <baw-progress [showZero]="zeroProgress">
      <baw-progress-bar
        color="success"
        description="Files which have been successfully processed"
        [progress]="progress"
      ></baw-progress-bar>

      <baw-progress-bar
        color="danger"
        description="Files which have failed to be processed"
        [progress]="errorProgress"
      ></baw-progress-bar>
    </baw-progress>
  `,
})
export class ProcessingComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get zeroProgress(): boolean {
    return this.progress + this.errorProgress === 0;
  }

  public get progress(): number {
    return this.stages.calculateProgress(this.report.itemsCompleted);
  }

  public get errorProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsFailed + this.report.itemsErrored
    );
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
