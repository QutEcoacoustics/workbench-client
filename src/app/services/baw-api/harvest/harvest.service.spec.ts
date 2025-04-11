import { BawApiService } from "@baw-api/baw-api.service";
import { Harvest } from "@models/Harvest";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateHarvest } from "@test/fakes/Harvest";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { of } from "rxjs";
import { HarvestsService, ShallowHarvestsService } from "./harvest.service";

describe("HarvestsService", () => {
  const harvestId = 10;
  const createModel = () => new Harvest(generateHarvest({ id: harvestId }));
  const baseUrl = "/projects/5/harvests/";
  let spec: SpectatorService<HarvestsService>;
  let shallowSpectator: SpectatorService<ShallowHarvestsService>;

  const createService = createServiceFactory({
    service: HarvestsService,
    imports: mockServiceImports,
    providers: [...mockServiceProviders, ShallowHarvestsService],
  });

  const createShallowService = createServiceFactory({
    service: ShallowHarvestsService,
    imports: mockServiceImports,
    providers: [...mockServiceProviders, ShallowHarvestsService],
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

  beforeEach((): void => {
    spec = createService();
    shallowSpectator = createShallowService();
  });

  function setup() {
    const mockHarvestApi: BawApiService<Harvest> = spec.inject<BawApiService<Harvest>>(BawApiService);
    spyOn(mockHarvestApi, "httpPatch").and.callFake((_path, _body, _options) => of());

    return mockHarvestApi;
  }

  describe("updateName", () => {
    it("should send a patch request to the server with the name property only as the body", () => {
      const mockHarvestApi = setup();
      const newHarvestName = "this is a test name";
      const mockHarvest = new Harvest(generateHarvest());

      shallowSpectator.service.updateName(mockHarvest, newHarvestName);

      expect(mockHarvestApi.httpPatch).toHaveBeenCalledWith(
        `/harvests/${mockHarvest.id}`,
        // disable eslint for this line because the harvest value
        // hasn't passed through the http interceptor api yet
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { Harvest: { name: newHarvestName } }
      );
    });
  });
});
