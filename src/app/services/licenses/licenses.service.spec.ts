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

  it("should have a method to return available licenses", async () => {
    const realizedResult = await spec.service.availableLicenses();
    expect(realizedResult).toBeTruthy();

    // try to fetch the MIT license from the result
    const mitLicense = realizedResult["MIT"];
    expect(mitLicense).toBeTruthy();
  });

  it("should dynamically import the licenses", () => {
    const importSpy = spyOn(import("spdx-license-list/full"), "then");
    spec.service.availableLicenses();
    expect(importSpy).toHaveBeenCalled();
  });
});
