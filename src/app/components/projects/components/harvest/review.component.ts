import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";

@Component({
  selector: "baw-harvest-review",
  template: `
    <h3>Review</h3>

    <p>123 files were successfully added</p>

    <p>456 files had errors</p>

    <div class="clearfix">
      <button
        class="btn btn-outline-primary float-start"
        (click)="onMakeChangesClick()"
      >
        Make Change
      </button>
      <button class="btn btn-primary float-end" (click)="onFinishClick()">
        Finish
      </button>
    </div>
  `,
})
export class HarvestReviewComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public onMakeChangesClick(): void {
    this.stage.emit(HarvestStage.batchUploading);
  }

  public onFinishClick(): void {
    this.stage.emit(HarvestStage.complete);
  }
}
