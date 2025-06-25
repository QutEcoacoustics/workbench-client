import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import {
  mockServiceProviders,
  validateApiCreate,
  validateApiDestroy,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { SiteSetting } from "@models/SiteSetting";
import { IdOrName } from "@baw-api/api-common";
import { generateSiteSetting } from "@test/fakes/SiteSetting";
import { Id, Param } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { SiteSettingsService } from "./site-settings.service";

describe("SiteSettingsService", () => {
  let spec: SpectatorService<SiteSettingsService>;
  const baseUrl = "/admin/site_settings/";

  const createService = createServiceFactory({
    service: SiteSettingsService,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should be created", () => {
    expect(spec.service).toBeInstanceOf(SiteSettingsService);
  });

  validateApiList<SiteSetting, [], SiteSettingsService>(
    createService,
    SiteSetting,
    baseUrl,
  );

  [false, true].forEach((hasName: boolean) => {
    let model: SiteSetting;
    const modelId = modelData.id();
    const modelName = "batch_analysis_remote_enqueue_limit";

    function updateUrl(): string {
      return baseUrl + modelIdentifier();
    }

    function modelIdentifier(): Id | Param | any {
      if (hasName) {
        return modelName;
      }

      return modelId;
    }

    beforeEach(() => {
      const name = hasName ? modelName : undefined;

      model = new SiteSetting(generateSiteSetting({
        id: modelId,
        name,
      }));
    });

    validateApiShow<SiteSetting, [IdOrName<SiteSetting>], SiteSettingsService>(
      () => spec,
      SiteSetting,
      updateUrl(),
      modelIdentifier(),
      () => model,
      undefined,
    );

    validateApiCreate<
      SiteSetting,
      [IdOrName<SiteSetting>],
      SiteSettingsService
    >(createService, SiteSetting, baseUrl, updateUrl(), () => model, undefined);

    validateApiUpdate<
      SiteSetting,
      [IdOrName<SiteSetting>],
      SiteSettingsService
    >(createService, SiteSetting, updateUrl(), () => model, undefined);

    validateApiDestroy<SiteSetting, [], SiteSettingsService>(
      createService,
      updateUrl(),
      modelIdentifier(),
      () => model,
    );
  });
});
