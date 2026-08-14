import { Spectator } from "@ngneat/spectator";
import { ChartComponent } from "@shared/chart/chart.component";

export function stubSharedChartResizeObserver(): void {
  ChartComponent.resizeObserver = jasmine.createSpyObj("ResizeObserver", [
    "observe",
    "unobserve",
    "disconnect",
  ]);
}

export function resetSharedChartResizeObserver(): void {
  ChartComponent.resizeObserver = undefined;
}

export async function waitForChartRender(spec: Spectator<unknown>): Promise<void> {
  const timeoutMs = 4000;
  const pollMs = 25;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    spec.detectChanges();
    await spec.fixture.whenStable();

    const hasRenderedChart =
      spec.query(".marks canvas") !== null ||
      spec.query(
        ".marks svg path, .marks svg line, .marks svg rect, .marks svg circle, .marks svg polygon, .marks svg polyline",
      ) !== null;

    if (hasRenderedChart) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  // Preserve historical behavior of this helper (tests assert on selectors),
  // but fail fast with actionable context if Vega never mounts.
  throw new Error(
    `Timed out waiting for chart render after ${timeoutMs}ms. ` +
      "Expected drawable Vega output under .marks (SVG primitives or canvas).",
  );
}

export function expectVegaMarks(
  spec: Spectator<unknown>,
  selector: string,
  minimum = 1,
): void {
  const marks = spec.queryAll(selector);

  expect(marks.length)
    .withContext(
      `Expected at least ${minimum} Vega mark(s) matching selector: ${selector}`,
    )
    .toBeGreaterThanOrEqual(minimum);
}

export function expectRenderedSvg(
  spec: Spectator<unknown>,
  minimum = 1,
): void {
  expectVegaMarks(spec, ".marks svg", minimum);
}

export function expectRenderedPaths(
  spec: Spectator<unknown>,
  minimum = 1,
): void {
  expectVegaMarks(
    spec,
    ".marks svg path, .marks svg line, .marks svg rect, .marks svg circle, .marks svg polygon, .marks svg polyline",
    minimum,
  );
}

export function stubElementWidth(
  element: HTMLElement,
  width: number,
  height = 240,
): void {
  spyOn(element, "getBoundingClientRect").and.returnValue({
    x: 0,
    y: 0,
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    toJSON: () => ({ width, height }),
  } as DOMRect);
}