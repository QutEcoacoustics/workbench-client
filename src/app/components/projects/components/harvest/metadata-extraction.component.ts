import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";

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
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get progress(): number {
    const { itemsMetadataGathered, itemsTotal } = this.stages.harvest.report;
    return (itemsMetadataGathered / itemsTotal) * 100;
  }
}
