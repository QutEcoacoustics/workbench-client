import { Component, Input } from "@angular/core";
import { toRelative } from "@interfaces/apiInterfaces";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { Duration } from "luxon";

@Component({
  selector: "baw-harvest-eta",
  template: `
    <div class="clearfix">
      <small class="text-muted font-monospace">
        {{ timeTaken }} {{ humanizeStage }}
      </small>
      <small *ngIf="!hasProgress()" class="float-end text-muted font-monospace">
        waiting in queue
      </small>
      <small *ngIf="hasProgress()" class="float-end text-muted font-monospace">
        ≈{{ expectedRemainingTime }} remaining
      </small>
    </div>
  `,
})
export class EtaComponent {
  @Input() public harvest: Harvest;
  @Input() public progress: number;

  public get humanizeStage(): string {
    const humanizedText: Partial<Record<HarvestStatus, string>> = {
      metadataExtraction: "extracting metadata",
      scanning: "scanning files",
      processing: "processing files",
    };
    return humanizedText[this.harvest.status];
  }

  public get timeTaken(): string {
    // TODO Use https://github.com/QutEcoacoustics/baw-server/issues/604
    // for calculation
    return toRelative(this.harvest.updatedAt.diffNow(), {
      round: true,
      largest: 2,
    });
  }

  public get expectedRemainingTime(): string {
    const progress = this.progress / 100;

    if (progress === 0) {
      return "unknown time";
    }

    // TODO Use https://github.com/QutEcoacoustics/baw-server/issues/604
    // for calculation
    const timeTakenSeconds = this.harvest.updatedAt.diffNow("seconds").seconds;
    const expectedRemainingTimeSeconds =
      timeTakenSeconds * (1 / progress) - timeTakenSeconds;
    return toRelative(
      Duration.fromMillis(expectedRemainingTimeSeconds * 1000),
      { round: true, largest: 2 }
    );
  }

  public hasProgress(): boolean {
    return this.progress > 0;
  }
}
