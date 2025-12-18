import { Component, OnInit, inject } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestReport } from "@models/Harvest";
import { ProgressComponent } from "@shared/progress/progress/progress.component";
import { ProgressBarComponent } from "@shared/progress/bar/bar.component";
import { CanCloseDialogComponent } from "../../components/shared/can-close-dialog.component";
import { EtaComponent } from "../../components/shared/eta.component";

@Component({
  selector: "baw-harvest-scanning",
  template: `
    <h3>Scanning</h3>

    <p>We are searching through our files to find all the files you uploaded</p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <h4>Progress</h4>

    <baw-harvest-eta
      [harvest]="harvest"
      [progress]="newFileProgress + metadataProgress"
    ></baw-harvest-eta>

    <baw-progress [showZero]="zeroProgress">
      <baw-progress-bar
        color="info"
        description="Files which have been found"
        [progress]="newFileProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        color="primary"
        description="Files which have had their metadata successfully extracted"
        [progress]="metadataProgress"
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
export class ScanningComponent implements OnInit {
  private readonly stages = inject(HarvestStagesService);

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get zeroProgress(): boolean {
    return this.newFileProgress + this.metadataProgress === 0;
  }

  public get newFileProgress(): number {
    return this.stages.calculateProgress(this.report.itemsNew);
  }

  public get metadataProgress(): number {
    return this.stages.calculateProgress(this.report.itemsMetadataGathered);
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
