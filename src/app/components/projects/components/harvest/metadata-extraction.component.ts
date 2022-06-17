import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";
import { HarvestReport } from "@models/Harvest";

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

    <div class="progress">
      <ng-container
        [ngTemplateOutlet]="progressBar"
        [ngTemplateOutletContext]="{
          progress: newFileProgress,
          color: 'bg-info'
        }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="progressBar"
        [ngTemplateOutletContext]="{
          progress: metadataProgress,
          color: 'bg-primary'
        }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="progressBar"
        [ngTemplateOutletContext]="{
          progress: errorProgress,
          color: 'bg-danger'
        }"
      ></ng-container>
    </div>

    <ng-template #progressBar let-progress="progress" let-color="color">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        [ngClass]="color"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        [ngStyle]="{ width: progress + '%' }"
        [attr.aria-valuenow]="progress"
      >
        {{ progress + "%" }}
      </div>
    </ng-template>
  `,
})
export class HarvestMetadataExtractionComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get newFileProgress(): number {
    return this.stages.calculateProgress(this.report.itemsNew);
  }

  public get metadataProgress(): number {
    return this.stages.calculateProgress(this.report.itemsMetadataGathered);
  }

  public get errorProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsErrored + this.report.itemsFailed
    );
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
