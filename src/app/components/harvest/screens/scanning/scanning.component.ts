import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { HarvestReport } from "@models/Harvest";

@Component({
  selector: "baw-harvest-scanning",
  template: `
    <h3>Scanning</h3>

    <p>We are searching through our files to find all the files you uploaded</p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <h4>Progress</h4>

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
})
export class ScanningComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get zeroProgress(): boolean {
    return this.report.itemsNew + this.report.itemsMetadataGathered === 0;
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
