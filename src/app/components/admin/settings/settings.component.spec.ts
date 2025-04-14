import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { CACHE_SETTINGS, CacheSettings } from "@services/cache/cache-settings";
import { AdminSettingsComponent } from "./settings.component";

describe("AdminSettingsComponent", () => {
  let spectator: Spectator<AdminSettingsComponent>;

  const createComponent = createComponentFactory({
    component: AdminSettingsComponent,
    imports: [MockBawApiModule],
    providers: [
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
    spectator.click(cacheEnabledInput());
    expect(cacheSettings().enabled).toBeFalse();

    spectator.click(cacheEnabledInput());
    expect(cacheSettings().enabled).toBeTrue();
  });

  it("should toggle the cache logging correctly", () => {
    spectator.click(cacheLoggingInput());
    expect(cacheSettings().showLogging).toBeTrue();

    spectator.click(cacheLoggingInput());
    expect(cacheSettings().showLogging).toBeFalse();
  });
});
