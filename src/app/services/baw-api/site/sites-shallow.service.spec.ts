import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSite } from "@test/fakes/Site";
import {
  validateCustomApiFilter,
  validateCustomApiList,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
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
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
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
