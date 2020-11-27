import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateSite } from "@test/fakes/Site";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { SitesService } from "./sites.service";

type Model = Site;
type Params = [IdOr<Project>];
type Service = SitesService;

describe("SitesService", function () {
  const createModel = () => new Site(generateSite(10));
  const baseUrl = "/projects/5/sites/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [SitesService],
    });

    this.service = TestBed.inject(SitesService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(baseUrl + "10", createModel, 5);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "10",
    10,
    createModel,
    5
  );

  validateCustomApiFilter<Model, [...Params, IdOr<Region>], Service>(
    baseUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 10 } } },
    undefined,
    5,
    10
  );
});
