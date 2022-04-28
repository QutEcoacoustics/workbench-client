import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { endWith, startWith, tap, timer } from "rxjs";

@Component({
  selector: "baw-harvest-file-verification",
  template: `
    <h3>Saving...</h3>

    <p>We are adding in all those files!</p>

    <p>
      You can leave this page and come back later. The process won't be
      interrupted.
    </p>

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
export class HarvestFileVerificationComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  private intervalSpeed = 300;
  public progress$ = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    endWith(100),
    tap((progress) => {
      if (progress >= 100) {
        this.stage.emit(HarvestStage.fileReview);
      }
    })
  );
}
