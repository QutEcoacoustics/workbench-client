import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
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

  describe("options", () => {
    it("should merge options correctly", () => {});

    it("should have the correct default options", () => {});
  });

  describe("element", () => {
    it("should be able to scroll to an element reference", () => {});

    it("should be able to scroll to a HTML element", () => {});
  });
});
