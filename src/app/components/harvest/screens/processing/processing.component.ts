import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestReport } from "@models/Harvest";
import { CanCloseDialogComponent } from "../../components/shared/can-close-dialog.component";
import { EtaComponent } from "../../components/shared/eta.component";
import { ProgressComponent } from "../../../shared/progress/progress/progress.component";
import { ProgressBarComponent } from "../../../shared/progress/bar/bar.component";

@Component({
    selector: "baw-harvest-processing",
    template: `
    <h3>Saving...</h3>

    <p>We are adding in all those files!</p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <baw-harvest-eta
      [harvest]="harvest"
      [progress]="successProgress + errorProgress"
    ></baw-harvest-eta>

    <baw-progress [showZero]="zeroProgress">
      <baw-progress-bar
        color="success"
        description="Files which have been successfully processed"
        [progress]="successProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        color="danger"
        description="Files which have failed to be processed"
        [progress]="errorProgress"
      ></baw-progress-bar>
    </baw-progress>
  `,
    imports: [CanCloseDialogComponent, EtaComponent, ProgressComponent, ProgressBarComponent]
})
export class ProcessingComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get zeroProgress(): boolean {
    return this.successProgress + this.errorProgress === 0;
  }

  public get successProgress(): number {
    return this.stages.calculateProgress(this.report.itemsCompleted);
  }

  public get errorProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsFailed + this.report.itemsErrored
    );
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
