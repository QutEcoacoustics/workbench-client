import { HarvestItem } from "@models/HarvestItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { ShallowHarvestItemsService } from "./harvest-items.service";

describe("ShallowHarvestItemsService", () => {
  // File path without leading '/'
  const harvestItemPath = modelData.system.filePath().slice(1);
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ path: harvestItemPath }));
  const baseUrl = "/harvests/5/items/";
  let spec: SpectatorService<ShallowHarvestItemsService>;
  const createService = createServiceFactory({
    service: ShallowHarvestItemsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi(
    () => spec,
    HarvestItem,
    baseUrl,
    baseUrl + "filter",
    baseUrl + harvestItemPath,
    createModel,
    undefined,
    5 // harvest
  );
});
