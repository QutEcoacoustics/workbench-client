import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

export interface Step {
  label: string;
  icon: IconProp;
}

@Component({
  selector: "baw-stepper",
  styleUrls: ["./stepper.component.scss"],
  template: `
    <div #stepper class="stepper mb-3">
      <div class="lines">
        <div #leftDots class="dots"></div>
        <div class="main"></div>
        <div #rightDots class="dots"></div>
      </div>

      <div #steps class="steps">
        @for (step of stepList; track step; let i = $index) {
          <div #step class="step" [class.active]="isActive(i)">
            <div class="step-body">
              <div class="icon" [class.active]="isActive(i)">
                <fa-icon size="xs" [icon]="step.icon"></fa-icon>
              </div>
              <div class="title fs-6 text-muted">{{ step.label }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [FaIconComponent],
})
export class StepperComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @ViewChild("stepper") public stepper: ElementRef<HTMLElement>;
  @ViewChild("leftDots") public leftDots: ElementRef<HTMLElement>;
  @ViewChild("rightDots") public rightDots: ElementRef<HTMLElement>;
  @ViewChild("steps") public steps: ElementRef<HTMLElement>;
  @ViewChildren("step") public stepItems: QueryList<ElementRef<HTMLElement>>;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input("steps") public stepList: Step[];
  /** Step to show as active, starting from 0 */
  @Input() public activeStep: number;

  private updateObservers: boolean;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;

  // CSS classes
  private notVisibleClass = "not-visible";
  private hiddenClass = "hidden";

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.stepList) {
      this.updateObservers = true;
    }
  }

  public ngAfterViewChecked(): void {
    // Nothing to update
    if (!this.updateObservers) {
      return;
    }

    this.updateObservers = false;
    this.destroyObservers();

    // Detect whenever an element intersects with the stepper wrapper
    this.intersectionObserver = new IntersectionObserver((entries): void => this.onIntersection(entries), {
      root: this.stepper.nativeElement,
      threshold: 1,
    });
    // Observe each step
    this.stepItems.forEach((step): void => this.intersectionObserver.observe(step.nativeElement));

    // Detect any resize events on the stepper wrapper
    this.resizeObserver = new ResizeObserver((): void => this.onWrapperResize());
    this.resizeObserver.observe(this.stepper.nativeElement);
  }

  public ngOnDestroy(): void {
    this.destroyObservers();
  }

  public isActive(step: number): boolean {
    return step === this.activeStep;
  }

  private destroyObservers() {
    // This may be called before ngAfterViewInit, so treat observers and
    // elements as potentially undefined
    this.stepItems?.forEach((step): void => this.intersectionObserver?.observe(step.nativeElement));
    this.resizeObserver?.unobserve(this.stepper?.nativeElement);
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
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
    const rightStepsNotVisible = isNotVisibleStep(this.stepItems.get(this.stepItems.length - 1));
    /** Show left dots if steps are hidden, and the first step is not active */
    const showLeftDots = leftStepsNotVisible && this.activeStep !== 0;
    /** Show right dots if steps are hidden, and the last step is not active */
    const showRightDots = rightStepsNotVisible && this.activeStep !== this.stepList.length - 1;

    // Show/Hide dots
    this.getClassList(this.leftDots).toggle(this.hiddenClass, !showLeftDots);
    this.getClassList(this.rightDots).toggle(this.hiddenClass, !showRightDots);
  }

  private onWrapperResize(): void {
    const active = this.stepItems.get(this.activeStep)?.nativeElement;
    // Active component is not yet rendered
    if (!active) {
      return;
    }
    this.steps.nativeElement.scroll(active.offsetLeft - active.clientWidth, 0);
  }

  private getClassList(ref: ElementRef<Element>) {
    return ref.nativeElement.classList;
  }
}
