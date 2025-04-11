import { Harvest } from "@models/Harvest";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvest } from "@test/fakes/Harvest";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { ShallowHarvestsService } from "./harvest.service";

describe("ShallowHarvestsService", () => {
  const harvestId = 5;
  const createModel = () => new Harvest(generateHarvest({ id: harvestId }));
  const baseUrl = "/harvests/";
  const showUrl = baseUrl + harvestId;
  let spec: SpectatorService<ShallowHarvestsService>;
  const createService = createServiceFactory({
    service: ShallowHarvestsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(() => spec, Harvest, baseUrl, baseUrl + "filter", showUrl, createModel, harvestId);

  // TODO Implement tests
  // xdescribe("transitionState", () => {});

  // xdescribe("updateMappings", () => {});
});
