import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  HarvestPolling,
  HarvestStage,
} from "@components/projects/pages/harvest/harvest.component";
import { Harvest } from "@models/Harvest";
import { endWith, startWith, tap, timer } from "rxjs";

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
        [value]="progress$ | async"
        [striped]="true"
        [animated]="true"
      ></ngb-progressbar>
    </p>
  `,
})
export class HarvestScanningComponent implements OnInit {
  @Input() public harvest: Harvest;
  @Input() public startPolling: HarvestPolling;

  @Output() public stage = new EventEmitter<HarvestStage>();

  public ngOnInit(): void {
    this.startPolling(5000);
  }
}
