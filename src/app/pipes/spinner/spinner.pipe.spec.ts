import { BootstrapScreenSizes } from "@helpers/bootstrapTypes";
import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { SpinnerPipe } from "./spinner.pipe";

describe("SpinnerPipe", () => {
  let spec: SpectatorPipe<SpinnerPipe>;
  const createPipe = createPipeFactory(SpinnerPipe);

  function assertSpinner(exists: boolean) {
    const spinner = spec.element.querySelector(".spinner-border span");
    expect(!!spinner).toBe(exists);
  }

  function setup(value: any, size?: BootstrapScreenSizes) {
    spec = createPipe(`<p [innerHTML]="value | spinner:size"></p>`, {
      hostProps: { value, size },
    });
  }

  it("should display spinner if value is undefined", () => {
    setup(undefined);
    assertSpinner(true);
  });

  it("should display spinner if value is null", () => {
    setup(null);
    assertSpinner(true);
  });

  it("should display inserted value if instantiated", () => {
    setup("custom value");
    assertSpinner(false);
    expect(spec.element).toHaveText("custom value");
  });

  describe("falsy values", () => {
    function testScenario(value: any) {
      setup(value);
      assertSpinner(false);
      expect(spec.element).toHaveText(value.toString());
    }

    it("should not display spinner if value is 0", () => {
      testScenario(0);
    });

    it("should not display spinner if value is false", () => {
      testScenario(false);
    });

    it("should not display spinner if value is an empty string", () => {
      testScenario("");
    });

    it("should not display spinner if value is an empty object", () => {
      testScenario({});
    });
  });

  describe("sizes", () => {
    Array<BootstrapScreenSizes>("xs", "sm", "md", "lg", "xl").forEach(
      (size) => {
        it(`should display ${size} size spinner`, () => {
          setup(undefined, size);
          const spinner = spec.element.querySelector(`.spinner-border-${size}`);
          expect(spinner).toBeTruthy();
        });
      }
    );
  });
});
