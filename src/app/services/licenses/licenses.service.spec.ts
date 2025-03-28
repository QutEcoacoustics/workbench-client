import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { LicensesService } from "./licenses.service";

describe("LicensesService", () => {
  let spec: SpectatorService<LicensesService>;

  const createService = createServiceFactory({
    service: LicensesService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should be created", () => {
    expect(spec.service).toBeInstanceOf(LicensesService);
  });
});
