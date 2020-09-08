import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FilterComponent } from "./filter.component";

describe("FilterComponent", () => {
  let spectator: SpectatorHost<FilterComponent>;
  const createHost = createHostFactory(FilterComponent);

  function setup(
    label?: string,
    placeholder?: string,
    onFilter?: (input: string) => any
  ) {
    // Conditionally add inputs so that baw-filter defaults aren't overridden
    spectator = createHost(
      `
      <baw-filter
        ${label ? '[label]="label"' : ""}
        ${placeholder ? '[placeholder]="placeholder"' : ""}
        (filter)="onFilter($event)"
      ></baw-filter>
      `,
      { hostProps: { label, placeholder, onFilter } }
    );
  }

  describe("label", () => {
    function assertLabel(label: string) {
      expect(spectator.query("span.input-group-text").textContent).toBe(label);
    }

    it("should display default label", () => {
      setup();
      assertLabel("Filter");
    });

    it("should display custom label", () => {
      setup("Custom Filter");
      assertLabel("Custom Filter");
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
