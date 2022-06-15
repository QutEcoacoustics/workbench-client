import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
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
export class HarvestScanningComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  private intervalSpeed = 150;
  public progress$ = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    endWith(100),
    tap((progress) => {
      if (progress >= 100) {
        this.stage.emit(HarvestStage.metadata_extraction);
      }
    })
  );
}
