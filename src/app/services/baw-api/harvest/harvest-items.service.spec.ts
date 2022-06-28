import { HarvestItem } from "@models/HarvestItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { HarvestItemsService } from "./harvest-items.service";

describe("HarvestItemsService", () => {
  // File path without leading '/'
  const harvestItemPath = modelData.system.filePath().slice(1);
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ path: harvestItemPath }));
  const baseUrl = "/projects/5/harvests/10/items/";
  let spec: SpectatorService<HarvestItemsService>;
  const createService = createServiceFactory({
    service: HarvestItemsService,
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
    undefined, // harvest item
    5, // project
    10 // harvest
  );
});
