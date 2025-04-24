import { IdOr } from "@baw-api/api-common";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import {
  mockServiceProviders,
  validateCustomApiFilter,
  validateCustomApiList,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ShallowSitesService } from "./sites.service";

type Model = Site;
type Service = ShallowSitesService;

describe("ShallowSitesService", (): void => {
  const createModel = () => new Site(generateSite({ id: 5 }));
  const baseUrl = "/sites/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowSitesService>;

  const createService = createServiceFactory({
    service: ShallowSitesService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Site,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  validateCustomApiList(() => spec, Site, baseUrl + "orphans/", "orphanList");

  validateCustomApiFilter(
    () => spec,
    Site,
    baseUrl + "orphans/filter",
    "orphanFilter"
  );

  validateCustomApiFilter<Model, [IdOr<User>], Service>(
    () => spec,
    Site,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  validateCustomApiFilter<Model, [IdOr<Region>], Service>(
    () => spec,
    Site,
    baseUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 5 } } },
    undefined,
    5
  );
});
