import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";
import { HarvestReport } from "@models/Harvest";

@Component({
  selector: "baw-harvest-scanning",
  template: `
    <h3>Scanning</h3>

    <p>We are searching through our files to find all the files you uploaded</p>

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
export class HarvestScanningComponent implements OnInit {
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

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
