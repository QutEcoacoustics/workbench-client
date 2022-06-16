import { Component, Input, OnInit } from "@angular/core";
import { HarvestPolling } from "@components/projects/pages/harvest/harvest.component";
import { Harvest } from "@models/Harvest";

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
  @Input() public harvest: Harvest;
  @Input() public startPolling: HarvestPolling;

  public ngOnInit(): void {
    this.startPolling(5000);
  }

  public get progress(): number {
    return (
      (this.harvest.report.itemsMetadataGathered /
        this.harvest.report.itemsTotal) *
      100
    );
  }
}
