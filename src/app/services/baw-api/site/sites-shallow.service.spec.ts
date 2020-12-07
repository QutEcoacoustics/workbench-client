import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
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
  const createModel = () => new Site(generateSite(5));
  const baseUrl = "/sites/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ShallowSitesService],
    });

    this.service = TestBed.inject(ShallowSitesService);
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
