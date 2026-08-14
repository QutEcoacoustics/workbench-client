import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { CACHE_SETTINGS, CacheSettings } from "@services/cache/cache-settings";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AdminSettingsComponent } from "./settings.component";

describe("AdminSettingsComponent", () => {
  let spectator: Spectator<AdminSettingsComponent>;

  const createComponent = createComponentFactory({
    component: AdminSettingsComponent,
    providers: [
      provideMockBawApi(),
      { provide: CACHE_SETTINGS, useValue: new CacheSettings(true, false) },
    ],
  });

  const cacheEnabledInput = () =>
    spectator.query<HTMLInputElement>("#enable-cache");
  const cacheLoggingInput = () =>
    spectator.query<HTMLInputElement>("#enable-cache-logging");

  function cacheSettings(): CacheSettings {
    return spectator.component.cacheSettings;
  }

  beforeEach(() => {
    spectator = createComponent();
  });

  assertPageInfo(AdminSettingsComponent, "Client Settings");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AdminSettingsComponent);
  });

  it("should toggle the cache enabled state correctly", () => {
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    spectator.click(cacheEnabledInput());
    expect(cacheSettings().enabled).toBeFalse();

    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    spectator.click(cacheEnabledInput());
    expect(cacheSettings().enabled).toBeTrue();
  });

  it("should toggle the cache logging correctly", () => {
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    spectator.click(cacheLoggingInput());
    expect(cacheSettings().showLogging).toBeTrue();

    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    spectator.click(cacheLoggingInput());
    expect(cacheSettings().showLogging).toBeFalse();
  });
});
