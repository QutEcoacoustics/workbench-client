import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { CacheSettings } from "@services/cache/cache-settings";
import { modelData } from "@test/helpers/faker";
import { AdminSettingsComponent } from "./settings.component";

describe("AdminSettingsComponent", () => {
  let spectator: Spectator<AdminSettingsComponent>;

  const createComponent = createComponentFactory({
    component: AdminSettingsComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  const cacheEnabledInput = () =>
    spectator.query<HTMLInputElement>("#enable-cache");
  const cacheLoggingInput = () =>
    spectator.query<HTMLInputElement>("#enable-cache-logging");
  const cacheLifetimeInput = () =>
    spectator.query<HTMLInputElement>("#cache-lifetime");

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

  it("should update the cache lifetime correctly", () => {
    const testedValue = modelData.seconds();
    spectator.typeInElement(testedValue.toString(), cacheLifetimeInput());
    expect(cacheSettings().cacheLifetimeSeconds).toEqual(testedValue);
  });
});
