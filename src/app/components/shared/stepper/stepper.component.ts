import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "baw-stepper",
  styleUrls: ["./stepper.component.scss"],
  template: `
    <div #stepper class="stepper">
      <div class="steps">
        <div *ngFor="let step of steps$ | async" class="step">
          <div class="text" [class.active]="isActive(step)">
            <p>{{ step }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StepperComponent implements AfterViewInit, OnDestroy {
  @ViewChild("stepper") public stepper: ElementRef<HTMLElement>;

  @Input() public numSteps: number;
  @Input() public activeStep: number;

  public steps$ = new BehaviorSubject<(string | number)[]>([]);
  private observer: ResizeObserver;
  // 50 px wide, plus 10 px width either side
  private stepWidth = 50 + 10 * 2;

  public constructor(private zone: NgZone) {}

  public ngAfterViewInit(): void {
    this.observer = new ResizeObserver((entries) => {
      this.zone.run(() => {
        const showShortFormat =
          entries[0].contentRect.width < this.numSteps * this.stepWidth;
        this.steps$.next(this.generateSteps(showShortFormat));
      });
    });
    this.observer.observe(this.stepper.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.unobserve(this.stepper?.nativeElement);
    this.observer.disconnect();
  }

  public isActive(step: string | number): boolean {
    return step === this.activeStep;
  }

  private generateSteps(short: boolean) {
    if (short) {
      const middleStep = this.activeStep ?? 1;
      return ["...", middleStep - 1, middleStep, middleStep + 1, "..."];
    } else {
      return Array(this.numSteps)
        .fill(0)
        .map((_, i): number => i);
    }
  }
}
