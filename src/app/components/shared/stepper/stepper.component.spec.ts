import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { viewports } from "@test/helpers/general";
import { StepperComponent } from "./stepper.component";

describe("StepperComponent", () => {
  let spec: Spectator<StepperComponent>;
  const createComponent = createComponentFactory({
    component: StepperComponent,
  });

  function getSteps() {
    return spec.queryAll(".step:not(.not-visible)");
  }

  afterEach(() => {
    viewport.reset();
  });

  describe("numSteps", () => {
    beforeEach(() => {
      viewport.set(viewports.extraLarge);
    });

    it("should create a single step", () => {
      spec = createComponent({ props: { numSteps: 1, activeStep: 0 } });

      const steps = getSteps();
      expect(steps).toHaveLength(1);
      expect(steps[0]).toHaveText("1");
    });

    it("should create multiple steps", () => {
      const numSteps = 10;
      spec = createComponent({ props: { numSteps, activeStep: 1 } });

      const steps = getSteps();
      expect(steps).toHaveLength(numSteps);

      for (let i = 0; i < numSteps; i++) {
        expect(steps[i]).toHaveText((i + 1).toString());
      }
    });
  });

  describe("activeStep", () => {
    it("should set active class on active step", () => {
      const numSteps = 3;
      spec = createComponent({ props: { numSteps, activeStep: 1 } });

      const steps = getSteps();
      expect(steps[0]).not.toHaveClass("active");
      expect(steps[1]).toHaveClass("active");
      expect(steps[2]).not.toHaveClass("active");
    });
  });

  describe("screen sizes", () => {
    function assertDottedLine(el: HTMLElement, visible: boolean) {
      expect(el).toHaveComputedStyle(
        visible
          ? { borderTop: "2px dashed rgb(156, 156, 156)", width: "64px" }
          : { width: "0px" }
      );
    }

    function getDottedLines() {
      return spec.queryAll<HTMLElement>(".dots");
    }

    function assertDottedLines(left: boolean, right: boolean): void {
      const [leftEl, rightEl] = getDottedLines();
      assertDottedLine(leftEl, left);
      assertDottedLine(rightEl, right);
    }

    async function waitForDottedLineStateUpdate(
      left: boolean,
      right: boolean,
      numSteps: number
    ): Promise<void> {
      const [leftEl, rightEl] = getDottedLines();

      const checkState = () =>
        getComputedStyle(leftEl).width === (left ? "64px" : "0px") &&
        getComputedStyle(rightEl).width === (right ? "64px" : "0px") &&
        getSteps().length === numSteps;

      return new Promise((resolve) => {
        interval = setInterval(() => {
          if (checkState()) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    }

    let interval: NodeJS.Timer;

    afterEach(() => {
      clearInterval(interval);
    });

    it("should not show dotted lines when no steps are hidden", async () => {
      viewport.set(1000, viewports.extraLargeDimensions.height);
      spec = createComponent({ props: { numSteps: 3, activeStep: 1 } });
      await waitForDottedLineStateUpdate(false, false, 3);
      spec.detectChanges();
      // Should show all steps
      expect(getSteps()).toHaveLength(3);
      assertDottedLines(false, false);
      spec.component.ngOnDestroy();
    });

    it("should only show dotted lines on right when right steps are hidden", async () => {
      viewport.set(1000, viewports.extraLargeDimensions.height);
      spec = createComponent({ props: { numSteps: 14, activeStep: 0 } });
      await waitForDottedLineStateUpdate(false, true, 13);
      spec.detectChanges();
      // Should only show 13 steps
      expect(getSteps()).toHaveLength(13);
      assertDottedLines(false, true);
      spec.component.ngOnDestroy();
    });

    it("should only show dotted line on left when left steps are hidden", async () => {
      viewport.set(1000, viewports.extraLargeDimensions.height);
      spec = createComponent({ props: { numSteps: 14, activeStep: 13 } });
      await waitForDottedLineStateUpdate(true, false, 13);
      spec.detectChanges();
      // Should only show 13 steps
      expect(getSteps()).toHaveLength(13);
      assertDottedLines(true, false);
      spec.component.ngOnDestroy();
    });

    it("should show dotted line on both sides when steps either side are hidden", async () => {
      viewport.set(1000, viewports.extraLargeDimensions.height);
      spec = createComponent({ props: { numSteps: 100, activeStep: 50 } });
      await waitForDottedLineStateUpdate(true, true, 13);
      spec.detectChanges();
      // Should only show 13 steps
      expect(getSteps()).toHaveLength(13);
      assertDottedLines(true, true);
      spec.component.ngOnDestroy();
    });
  });
});
