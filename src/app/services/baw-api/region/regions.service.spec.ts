import { IdOr } from "@baw-api/api-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateRegion } from "@test/fakes/Region";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { RegionsService } from "./regions.service";

type Model = Region;
type Params = [IdOr<Project>];
type Service = RegionsService;

describe("RegionsService", (): void => {
  const createModel = () => new Region(generateRegion({ id: 10 }));
  const baseUrl = "/projects/5/regions/";
  const updateUrl = baseUrl + "10";
  let spec: SpectatorService<RegionsService>;
  const createService = createServiceFactory({
    service: RegionsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Region,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    10,
    5
  );
});
