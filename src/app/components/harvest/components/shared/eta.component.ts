import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { toRelative } from "@interfaces/apiInterfaces";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { Duration } from "luxon";
import { map, Observable, timer } from "rxjs";

@Component({
  selector: "baw-harvest-eta",
  template: `
    <div class="clearfix">
      <small class="text-muted font-monospace">
        {{ timeTaken$ | async }} {{ humanizeStage }}
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
export class EtaComponent implements OnInit, OnChanges {
  @Input() public harvest: Harvest;
  @Input() public progress: number;

  public timeTaken$: Observable<string>;
  public expectedRemainingTime$: Observable<string>;

  public get humanizeStage(): string {
    const humanizedText: Partial<Record<HarvestStatus, string>> = {
      metadataExtraction: "extracting metadata",
      scanning: "scanning files",
      processing: "processing files",
    };
    return humanizedText[this.harvest.status];
  }

  public expectedRemainingTime: string;

  public ngOnInit(): void {
    this.timeTaken$ = timer(0, 1000).pipe(
      map((): string =>
        // TODO Use https://github.com/QutEcoacoustics/baw-server/issues/604
        // for calculation
        toRelative(this.harvest.updatedAt.diffNow(), {
          round: true,
          largest: 2,
        })
      )
    );
  }

  public ngOnChanges({ progress }: SimpleChanges): void {
    // Only update on changes to the progress
    if (!isInstantiated(progress)) {
      return;
    }

    if (this.progress === 0) {
      this.expectedRemainingTime = "unknown time";
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
    const expectedRemainingTimeSeconds =
      timeTakenSeconds * (1 / (this.progress / 100)) - timeTakenSeconds;
    this.expectedRemainingTime = toRelative(
      Duration.fromMillis(expectedRemainingTimeSeconds * 1000),
      { round: true, largest: 2 }
    );
  }

  public hasProgress(): boolean {
    return this.progress > 0;
  }
}
