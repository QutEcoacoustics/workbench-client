import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { DebouncedInputDirective } from "./debounced-input.directive";

describe("DebouncedInputDirective", () => {
  let spec: SpectatorDirective<DebouncedInputDirective>;

  const createDirective = createDirectiveFactory({
    directive: DebouncedInputDirective,
  });

  const inputElement = () => spec.query<HTMLInputElement>("input");

  function setup(placeholder?: string, onFilter?: (input: string) => unknown) {
    // Conditionally add inputs so that baw-debounce-input defaults aren't overridden
    spec = createDirective(
      `
      <input [bawDebouncedInput]
        ${placeholder ? '[placeholder]="placeholder"' : ""}
        (valueChange)="onFilter($event)"
      />
      `,
      { hostProps: { placeholder, onFilter } }
    );
  }


  it("should create", () => {
    setup();
    expect(spec.directive).toBeInstanceOf(DebouncedInputDirective);
  });


  describe("placeholder", () => {
    it("should handle no placeholder", () => {
      setup();
      expect(inputElement()).toHaveProperty("placeholder", "");
    });

    it("should display custom placeholder", () => {
      setup("Custom Placeholder");
      expect(inputElement()).toHaveProperty("placeholder", "Custom Placeholder");
    });
  });


  describe("input", () => {
    // Spectator.typeInElement not triggering update for some reason
    function keyboardPress(...keys: string[]) {
      keys.forEach((_, index) => {
        spec.typeInElement(
          keys.join("").substring(0, index + 1),
          inputElement()
        );
      });
    }

    it("should output on input", (done) => {
      setup(undefined, (input) => {
        expect(input).toEqual("a");
        done();
      });
      keyboardPress("a");
    });

    it("should output once on multiple key presses", (done) => {
      setup(undefined, (input) => {
        expect(input).toEqual("abc");
        done();
      });
      keyboardPress("a", "b", "c");
    });
  });
});
