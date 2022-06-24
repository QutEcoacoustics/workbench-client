import { Harvest } from "@models/Harvest";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvest } from "@test/fakes/Harvest";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { HarvestsService, ShallowHarvestsService } from "./harvest.service";

describe("HarvestsService", () => {
  const harvestId = 10;
  const createModel = () => new Harvest(generateHarvest({ id: harvestId }));
  const baseUrl = "/projects/5/harvests/";
  let spec: SpectatorService<HarvestsService>;
  const createService = createServiceFactory({
    service: HarvestsService,
    imports: mockServiceImports,
    providers: [...mockServiceProviders, ShallowHarvestsService],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Harvest,
    baseUrl,
    baseUrl + "filter",
    baseUrl + harvestId,
    createModel,
    harvestId, // harvest
    5 //project
  );
});
