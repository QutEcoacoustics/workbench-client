import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  HarvestPolling,
  HarvestStage,
} from "@components/projects/pages/harvest/harvest.component";
import { Harvest } from "@models/Harvest";

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
  @Input() public harvest: Harvest;
  @Input() public startPolling: HarvestPolling;
  @Output() public stage = new EventEmitter<HarvestStage>();

  public ngOnInit(): void {
    this.startPolling(5000);
  }

  public get progress(): number {
    return (
      ((this.harvest.report.itemsCompleted +
        this.harvest.report.itemsFailed +
        this.harvest.report.itemsErrored) /
        this.harvest.report.itemsTotal) *
      100
    );
  }
}
