import { HarvestItem } from "@models/HarvestItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { ShallowHarvestItemsService } from "./harvest-items.service";

describe("ShallowHarvestItemsService", () => {
  const harvestItemId = 10;
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ id: harvestItemId }));
  const baseUrl = "/harvest/5/harvest_items/";
  const showUrl = baseUrl + harvestItemId;
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
    showUrl,
    createModel,
    harvestItemId, // harvest item
    5 // harvest
  );
});
