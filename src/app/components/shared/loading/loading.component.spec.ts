import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { LoadingComponent } from "./loading.component";

describe("LoadingComponent", () => {
  let spectator: Spectator<LoadingComponent>;
  const createComponent = createComponentFactory({
    component: LoadingComponent,
    imports: [NgbModule],
  });

  beforeEach(() => (spectator = createComponent()));

  describe("display", () => {
    it("should exist when display true", () => {
      spectator.setInput("display", true);
      expect(spectator.element.childElementCount).toBe(1);
    });

    it("should display bootstrap spinner when display true", () => {
      spectator.setInput("display", true);
      expect(spectator.query(".spinner-border")).toBeTruthy();
    });

    it("should not exist when display true", () => {
      spectator.setInput("display", false);
      expect(spectator.element.childElementCount).toBe(0);
    });

    it("should update on display state change", () => {
      spectator.setInput("display", true);
      expect(spectator.query(".spinner-border")).toBeTruthy();
      spectator.setInput("display", false);
      expect(spectator.element.childElementCount).toBe(0);
    });
  });

  describe("title", () => {
    it("should handle missing title", () => {
      spectator.setInput("display", true);

      const title = spectator.query<HTMLHeadingElement>("h4");
      expect(title).toBeFalsy();
    });

    it("should display title", () => {
      spectator.setInput("display", true);
      spectator.setInput("title", "custom title");

      const title = spectator.query<HTMLHeadingElement>("h4").innerText.trim();
      expect(title).toBe("custom title");
    });
  });

  describe("type", () => {
    const types = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "light",
      "dark",
    ];

    types.forEach((type) => {
      it("should display loading spinner with class " + type, () => {
        spectator.setInput("display", true);
        spectator.setInput("type", type as any);

        expect(spectator.query(".spinner-border")).toHaveClass("text-" + type);
      });
    });
  });
});
