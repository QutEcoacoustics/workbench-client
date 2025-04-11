import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { Duration } from "luxon";
import { TimeSinceComponent } from "../../../shared/datetime-formats/time-since/time-since.component";
import { DurationComponent } from "../../../shared/datetime-formats/duration/duration.component";

// TODO Use https://github.com/QutEcoacoustics/baw-server/issues/604
@Component({
  selector: "baw-harvest-eta",
  template: `
    <div class="clearfix">
      <small class="text-muted font-monospace">
        <!-- eg. Started uploading 15 seconds ago -->
        Started {{ humanizeStage }}
        <baw-time-since [value]="harvest.updatedAt" />
      </small>
      @if (!hasProgress()) {
        <small class="float-end text-muted font-monospace"> waiting in queue </small>
      }
      @if (hasProgress()) {
        <small class="float-end text-muted font-monospace">
          @if (expectedRemainingTime && hasProgress()) {
            ≈<baw-duration [value]="expectedRemainingTime" humanized />
            remaining
          } @else {
            unknown time remaining
          }
        </small>
      }
    </div>
  `,
  imports: [TimeSinceComponent, DurationComponent],
})
export class EtaComponent implements OnChanges {
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

  public expectedRemainingTime: Duration;

  public ngOnChanges({ progress }: SimpleChanges): void {
    // Only update on changes to the progress
    if (!isInstantiated(progress) && this.hasProgress()) {
      return;
    }

    /*
     * TODO Use https://github.com/QutEcoacoustics/baw-server/issues/604
     * for calculation
     * TODO We should average over recent window of harvest items times time
     * taken to transition (ie, using the latest 10-15 reports to calculate
     * items/second). The current solution can be extremely inaccurate when
     * there is a delay or slowdown of processing items (ie. another
     * harvest is queued and takes up all of the available computing
     * resources)
     */
    const timeTakenSeconds = this.harvest.updatedAt.diffNow("seconds").seconds;
    const expectedRemainingTimeSeconds = timeTakenSeconds * (1 / (this.progress / 100)) - timeTakenSeconds;
    this.expectedRemainingTime = Duration.fromMillis(expectedRemainingTimeSeconds * 1000);
  }

  public hasProgress(): boolean {
    return this.progress > 0;
  }
}
