import { HarvestItem } from "@models/HarvestItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { HarvestItemsService } from "./harvest-items.service";

describe("HarvestItemsService", () => {
  const harvestItemId = 15;
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ id: harvestItemId }));
  const baseUrl = "/projects/5/harvest/10/harvest_items/";
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
    baseUrl + harvestItemId,
    createModel,
    harvestItemId, // harvest item
    5, // project
    10 // harvest
  );
});
