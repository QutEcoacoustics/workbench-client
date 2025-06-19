import { SpectatorService } from "@ngneat/spectator";
import { SiteSettingsService } from "./site-settings.service";

describe("SiteSettingsService", () => {
  let spec: SpectatorService<SiteSettingsService>;

  it("should be created", () => {
    expect(spec.service).toBeInstanceOf(SiteSettingsService);
  });
});
