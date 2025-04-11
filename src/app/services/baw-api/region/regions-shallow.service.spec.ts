import { Region } from "@models/Region";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateRegion } from "@test/fakes/Region";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ShallowRegionsService } from "./regions.service";

describe("ShallowRegionsService", function () {
  const createModel = () => new Region(generateRegion({ id: 5 }));
  const baseUrl = "/regions/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowRegionsService>;
  const createService = createServiceFactory({
    service: ShallowRegionsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Region,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
