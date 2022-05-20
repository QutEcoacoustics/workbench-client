import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { endWith, startWith, tap, timer } from "rxjs";

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
        [value]="progress$ | async"
        [striped]="true"
        [animated]="true"
      ></ngb-progressbar>
    </p>
  `,
})
export class HarvestMetadataExtractionComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  private intervalSpeed = 300;
  public progress$ = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    endWith(100),
    tap((progress) => {
      if (progress >= 100) {
        this.stage.emit(HarvestStage.metadataReview);
      }
    })
  );
}
