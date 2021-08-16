import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSite } from "@test/fakes/Site";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
  validateCustomApiList,
} from "@test/helpers/api-common";
import { ShallowSitesService } from "./sites.service";

type Model = Site;
type Params = [];
type Service = ShallowSitesService;

describe("ShallowSitesService", function () {
  const createModel = () => new Site(generateSite({ id: 5 }));
  const baseUrl = "/sites/";
  const createService = createServiceFactory({
    service: ShallowSitesService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);

  validateCustomApiList<Model, Params, Service>(
    baseUrl + "orphans/",
    "orphanList"
  );

  validateCustomApiFilter<Model, Params, Service>(
    baseUrl + "orphans/filter",
    "orphanFilter"
  );

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  validateCustomApiFilter<Model, [...Params, IdOr<Region>], Service>(
    baseUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 5 } } },
    undefined,
    5
  );
});
