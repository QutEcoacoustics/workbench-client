import { Component, Input, OnInit } from "@angular/core";
import { HarvestPolling } from "@components/projects/pages/harvest/harvest.component";
import { Harvest } from "@models/Harvest";

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
export class HarvestMetadataExtractionComponent implements OnInit {
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
