import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ToastsService } from "./toasts.service";

describe("ToastsService", () => {
  let spec: SpectatorService<ToastsService>;

  const createService = createServiceFactory({
    service: ToastsService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(ToastsService);
  });
});
