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

  describe("licenseText", () => {
    it("should return the correct license text for a spdx license", async () => {});

    it("should return 'Custom License' for a non-spdx license", async () => {});

    it("should return 'No License' for a null license", async () => {});

    it("should return 'No License' for an empty string license", async () => {});
  });

  it("should have a method to return available licenses", async () => {
    const realizedResult = await spec.service.availableLicenses();
    expect(realizedResult).toBeTruthy();

    // try to fetch the MIT license from the result
    const mitLicense = realizedResult["MIT"];
    expect(mitLicense).toBeTruthy();
  });

  it("should have the correct suggested licenses", () => {});

  it("should return the correct typeahead callback", () => {});

  it("should correctly recognize a spdx license", () => {});

  it("should correctly recognize a non-spdx license", () => {});
});
