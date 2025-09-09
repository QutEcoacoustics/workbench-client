import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ElementRef } from "@angular/core";
import { ScrollService } from "./scroll.service";

describe("ScrollServiceService", () => {
  let spec: SpectatorService<ScrollService>;

  const createService = createServiceFactory({
    service: ScrollService,
  })

  beforeEach(() => {
    spec = createService();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(ScrollService);
  });

  // We test scrolling to an element rather than an ElementRef in later tests.
  // This test is just to ensure that both types are accepted.
  it("should be able to scroll to an ElementRef", () => {
    const testedElement = document.createElement("div");
    const elementRef = new ElementRef(testedElement);

    const scrollIntoViewSpy = spyOn(testedElement, "scrollIntoView");

    spec.service.scrollToElement(elementRef);

    expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
  });

  describe("options", () => {
    it("should merge options correctly", () => {
      const testedOptions: ScrollIntoViewOptions = {
        behavior: "auto",
        block: "start",
      };

      const testedElement = document.createElement("div");
      const scrollIntoViewSpy = spyOn(testedElement, "scrollIntoView");

      spec.service.scrollToElement(testedElement, testedOptions);

      expect(scrollIntoViewSpy).toHaveBeenCalledOnceWith(testedOptions);
    });

    it("should have the correct default options", () => {
      const defaultOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "center",
      };

      const testedElement = document.createElement("div");
      const scrollIntoViewSpy = spyOn(testedElement, "scrollIntoView");

      spec.service.scrollToElement(testedElement);

      expect(scrollIntoViewSpy).toHaveBeenCalledOnceWith(defaultOptions);
    });
  });
});
