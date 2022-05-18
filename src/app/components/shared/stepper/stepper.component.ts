import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";

@Component({
  selector: "baw-stepper",
  styleUrls: ["./stepper.component.scss"],
  template: `
    <div #stepper class="stepper">
      <div class="lines">
        <div #leftDots class="dots"></div>
        <div class="main"></div>
        <div #rightDots class="dots"></div>
      </div>

      <div #steps class="steps">
        <div
          #step
          *ngFor="let step of stepLabels"
          class="step"
          [class.active]="isActive(step)"
        >
          <p>{{ step }}</p>
        </div>
      </div>
    </div>
  `,
})
export class StepperComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild("stepper") public stepper: ElementRef<HTMLElement>;
  @ViewChild("leftDots") public leftDots: ElementRef<HTMLElement>;
  @ViewChild("rightDots") public rightDots: ElementRef<HTMLElement>;
  @ViewChild("steps") public steps: ElementRef<HTMLElement>;
  @ViewChildren("step") public stepItems: QueryList<ElementRef<HTMLElement>>;

  @Input() public numSteps: number;
  @Input() public activeStep: number;

  public stepLabels: number[];
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;

  // CSS classes
  private notVisibleClass = "not-visible";
  private activeClass = "active";
  private hiddenClass = "hidden";

  public constructor(private zone: NgZone) {}

  public ngOnChanges(): void {
    this.stepLabels = Array(this.numSteps)
      .fill(0)
      .map((_, i): number => i);
  }

  public ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries): void => {
        this.zone.run(() => {
          for (const entry of entries) {
            const intersecting = entry.isIntersecting;
            entry.target.classList.toggle(this.notVisibleClass, !intersecting);
          }

          const isNotVisibleStep = (step: ElementRef<HTMLElement>) =>
            step.nativeElement.classList.contains(this.notVisibleClass);

          /** Do steps on the left side of the stepper have the not visible class */
          const leftStepsNotVisible = isNotVisibleStep(this.stepItems.get(0));
          /** Do steps on the right side of the stepper have the not visible class */
          const rightStepsNotVisible = isNotVisibleStep(
            this.stepItems.get(this.stepItems.length - 1)
          );
          /** What is the index of the active step */
          const activeStepIndex = this.stepItems
            .toArray()
            .findIndex((step) =>
              step.nativeElement.classList.contains(this.activeClass)
            );

          /** Show left dots if steps are hidden, and the first step is not active */
          const showLeftDots = leftStepsNotVisible && activeStepIndex !== 0;
          /** Show right dots if steps are hidden, and the last step is not active */
          const showRightDots =
            rightStepsNotVisible && activeStepIndex !== this.numSteps - 1;

          // Show/Hide dots
          this.leftDots.nativeElement.classList.toggle(
            this.hiddenClass,
            !showLeftDots
          );
          this.rightDots.nativeElement.classList.toggle(
            this.hiddenClass,
            !showRightDots
          );
        });
      },
      {
        root: this.stepper.nativeElement,
        threshold: 1,
      }
    );

    this.stepItems.forEach((step) => {
      this.intersectionObserver.observe(step.nativeElement);
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.zone.run(() => {
        const active = this.stepItems.find((step) =>
          step.nativeElement.classList.contains(this.activeClass)
        ).nativeElement;
        this.steps.nativeElement.scroll(
          active.offsetLeft - active.clientWidth,
          0
        );
      });
    });
    this.resizeObserver.observe(this.stepper.nativeElement);
  }

  public ngOnDestroy(): void {
    this.intersectionObserver.unobserve(this.stepper?.nativeElement);
    this.resizeObserver.unobserve(this.stepper?.nativeElement);
    this.intersectionObserver.disconnect();
    this.resizeObserver.disconnect();
  }

  public isActive(step: number): boolean {
    return step === this.activeStep;
  }
}
