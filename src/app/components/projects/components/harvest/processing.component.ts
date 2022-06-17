import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";

@Component({
  selector: "baw-harvest-processing",
  template: `
    <h3>Saving...</h3>

    <p>We are adding in all those files!</p>

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
export class HarvestProcessingComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get progress(): number {
    const { itemsCompleted, itemsFailed, itemsErrored, itemsTotal } =
      this.stages.harvest.report;
    return ((itemsCompleted + itemsFailed + itemsErrored) / itemsTotal) * 100;
  }
}
