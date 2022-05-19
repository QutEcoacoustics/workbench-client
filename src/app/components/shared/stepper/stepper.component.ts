import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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
          <p>{{ step + 1 }}</p>
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

  /** Number of steps to display */
  @Input() public numSteps: number;
  /** Step to show as active, starting from 0 */
  @Input() public activeStep: number;

  public stepLabels: number[];
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;

  // CSS classes
  private notVisibleClass = "not-visible";
  private hiddenClass = "hidden";

  public constructor() {}

  public ngOnChanges(): void {
    this.stepLabels = Array(this.numSteps)
      .fill(0)
      .map((_, i): number => i);
  }

  public ngAfterViewInit(): void {
    // Detect whenever an element intersects with the stepper wrapper
    this.intersectionObserver = new IntersectionObserver(
      (entries): void => this.onIntersection(entries),
      { root: this.stepper.nativeElement, threshold: 1 }
    );
    // Observe each step
    this.stepItems.forEach((step): void =>
      this.intersectionObserver.observe(step.nativeElement)
    );

    // Detect any resize events on the stepper wrapper
    this.resizeObserver = new ResizeObserver((): void =>
      this.onWrapperResize()
    );
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

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    // Update any steps so they track whether they are currently displayed outside of the wrapper
    for (const entry of entries) {
      const intersecting = entry.isIntersecting;
      entry.target.classList.toggle(this.notVisibleClass, !intersecting);
    }

    const isNotVisibleStep = (step: ElementRef<HTMLElement>): boolean =>
      this.getClassList(step).contains(this.notVisibleClass);

    /** Do steps on the left side of the stepper have the not visible class */
    const leftStepsNotVisible = isNotVisibleStep(this.stepItems.get(0));
    /** Do steps on the right side of the stepper have the not visible class */
    const rightStepsNotVisible = isNotVisibleStep(
      this.stepItems.get(this.stepItems.length - 1)
    );
    /** Show left dots if steps are hidden, and the first step is not active */
    const showLeftDots = leftStepsNotVisible && this.activeStep !== 0;
    /** Show right dots if steps are hidden, and the last step is not active */
    const showRightDots =
      rightStepsNotVisible && this.activeStep !== this.numSteps - 1;

    // Show/Hide dots
    this.getClassList(this.leftDots).toggle(this.hiddenClass, !showLeftDots);
    this.getClassList(this.rightDots).toggle(this.hiddenClass, !showRightDots);
  }

  private onWrapperResize(): void {
    const active = this.stepItems.get(this.activeStep).nativeElement;
    this.steps.nativeElement.scroll(active.offsetLeft - active.clientWidth, 0);
  }

  private getClassList(ref: ElementRef<Element>) {
    return ref.nativeElement.classList;
  }
}
