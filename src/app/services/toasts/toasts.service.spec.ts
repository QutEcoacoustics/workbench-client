import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ToastService } from "./toasts.service";

describe("ToastsService", () => {
  let spec: SpectatorService<ToastService>;

  const createService = createServiceFactory({
    service: ToastService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(ToastService);
  });
});
