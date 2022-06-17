import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";

@Component({
  selector: "baw-harvest-scanning",
  template: `
    <h3>Scanning</h3>

    <p>We are searching through our files to find all the files you uploaded</p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <p>
      <ngb-progressbar
        type="success"
        [showValue]="true"
        [striped]="true"
        [animated]="true"
        [value]="progress"
      ></ngb-progressbar>
    </p>
  `,
})
export class HarvestScanningComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get progress(): number {
    const { itemsMetadataGathered, itemsTotal } = this.stages.harvest.report;
    return (itemsMetadataGathered / itemsTotal) * 100;
  }
}
