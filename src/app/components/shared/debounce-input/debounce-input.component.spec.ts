import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { DebounceInputComponent } from "./debounce-input.component";

describe("DebounceInputComponent", () => {
  let spectator: SpectatorHost<DebounceInputComponent>;
  const createHost = createHostFactory(DebounceInputComponent);

  function setup(
    label?: string,
    placeholder?: string,
    onFilter?: (input: string) => any
  ) {
    // Conditionally add inputs so that baw-debounce-input defaults aren't overridden
    spectator = createHost(
      `
      <baw-debounce-input
        ${label ? '[label]="label"' : ""}
        ${placeholder ? '[placeholder]="placeholder"' : ""}
        (filter)="onFilter($event)"
      ></baw-debounce-input>
      `,
      { hostProps: { label, placeholder, onFilter } }
    );
  }

  describe("label", () => {
    function getLabel() {
      return spectator.query("span.input-group-text");
    }

    it("should hide label when none provided", () => {
      setup();
      expect(getLabel()).toBeFalsy();
    });

    it("should display custom label", () => {
      setup("Custom Filter");
      expect(getLabel().textContent).toBe("Custom Filter");
    });
  });

  describe("placeholder", () => {
    function assertPlaceholder(placeholder: string) {
      expect(spectator.query<HTMLInputElement>("input").placeholder).toBe(
        placeholder
      );
    }

    it("should handle no placeholder", () => {
      setup();
      assertPlaceholder("");
    });

    it("should display custom placeholder", () => {
      setup(undefined, "Custom Placeholder");
      assertPlaceholder("Custom Placeholder");
    });
  });

  describe("input", () => {
    function getInput() {
      return spectator.query("input");
    }

    // Spectator.typeInElement not triggering update for some reason
    function keyboardPress(...keys: string[]) {
      keys.forEach((_, index) => {
        spectator.typeInElement(
          keys.join("").substring(0, index + 1),
          getInput()
        );
        getInput().dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
      });
    }

    it("should output on keyup", (done) => {
      setup(undefined, undefined, (input) => {
        expect(input).toBe("a");
        done();
      });
      keyboardPress("a");
    });

    it("should output once on multiple key presses", (done) => {
      setup(undefined, undefined, (input) => {
        expect(input).toBe("abc");
        done();
      });
      keyboardPress("a", "b", "c");
    });
  });
});
