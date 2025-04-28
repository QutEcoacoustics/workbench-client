import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestReport } from "@models/Harvest";
import { ProgressComponent } from "@shared/progress/progress/progress.component";
import { ProgressBarComponent } from "@shared/progress/bar/bar.component";
import { CanCloseDialogComponent } from "../../components/shared/can-close-dialog.component";
import { EtaComponent } from "../../components/shared/eta.component";

@Component({
  selector: "baw-harvest-metadata-extraction",
  template: `
    <h3>Checking Files</h3>

    <p>We are checking the files you uploaded!</p>

    <p>
      We will make sure files have no errors and find any extra information
      about them.
    </p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <h4>Progress</h4>

    <baw-harvest-eta
      [harvest]="harvest"
      [progress]="progress"
    ></baw-harvest-eta>

    <baw-progress [showZero]="progress === 0">
      <baw-progress-bar
        color="success"
        description="Files which have been processed"
        [progress]="progress"
      ></baw-progress-bar>
    </baw-progress>

    <h4 class="mt-3">File Status</h4>

    <baw-progress [showZero]="!hasFileStatuses">
      <baw-progress-bar
        color="success"
        description="Files which have no problems"
        [striped]="false"
        [progress]="successProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        color="warning"
        description="Files which have some problems, however can be fixed"
        [striped]="false"
        [progress]="invalidFixableProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        color="danger"
        description="Files which have some problems, and cannot be fixed"
        [striped]="false"
        [progress]="errorProgress"
      ></baw-progress-bar>
    </baw-progress>
  `,
  imports: [
    CanCloseDialogComponent,
    EtaComponent,
    ProgressComponent,
    ProgressBarComponent,
  ],
})
export class MetadataExtractionComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get progress(): number {
    return this.stages.calculateProgress(this.report.itemsMetadataGathered);
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }

  public hasFileStatuses(): boolean {
    return (
      this.successProgress + this.invalidFixableProgress + this.errorProgress >
      0
    );
  }

  public get successProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsTotal -
        this.report.itemsInvalidFixable -
        this.report.itemsInvalidNotFixable
    );
  }

  public get invalidFixableProgress(): number {
    return this.stages.calculateProgress(this.report.itemsInvalidFixable);
  }

  public get errorProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsInvalidNotFixable +
        this.report.itemsErrored +
        this.report.itemsFailed
    );
  }
}
