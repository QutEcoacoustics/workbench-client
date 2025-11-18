import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SafeNumberComponent } from "./number.component";

describe("SafeNumberComponent", () => {
  let spec: Spectator<SafeNumberComponent>;

  const createComponent = createComponentFactory({
    component: SafeNumberComponent,
  });

  function setup(value: unknown): void {
    spec = createComponent({
      props: { value },
    });
  }

  it("should create", () => {
    setup(42);
    expect(spec.component).toBeInstanceOf(SafeNumberComponent);
  });

  it("should display the correct message for an 'undefined' value", () => {
    setup(undefined);
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("(missing)");
  });

  it("should display the correct message for a 'null' value", () => {
    setup(null);
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("(missing)");
  });

  it("should correctly update from an invalid value to a valid number", () => {
    setup("not a number");
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("Type Error");

    spec.setInput("value", 100);
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("100");

    // Assert that we can also go back to invalid and a missing value state
    spec.setInput("value", undefined);
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("(missing)");

    spec.setInput("value", {});
    expect(spec.fixture.nativeElement).toHaveExactTrimmedText("Type Error");
  });

  it("should have the correct tooltip for a string", () => {
    const expectedTooltip = "Expected a number type. Found 'string'.";
    setup("55");

    const tooltipHint = spec.query(".tooltip-hint")!;
    expect(tooltipHint).toHaveTooltip(expectedTooltip);
  });

  it("should have the correct tooltip for a null value", () => {
    const expectedTooltip = "Expected a number type. Found 'null'.";
    setup(null);

    const tooltipHint = spec.query(".tooltip-hint")!;
    expect(tooltipHint).toHaveTooltip(expectedTooltip);
  });

  const nonValidTypes = ["42", {}, [], true, false];
  for (const invalidValue of nonValidTypes) {
    it(`should display incorrect type message for value: ${JSON.stringify(invalidValue)}`, () => {
      setup(invalidValue);
      expect(spec.fixture.nativeElement).toHaveExactTrimmedText("Type Error");
    });
  }
});
