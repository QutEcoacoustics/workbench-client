import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Region } from "@models/Region";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateRegion } from "@test/fakes/Region";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { ShallowRegionsService } from "./regions.service";

type Model = Region;
type Params = [];
type Service = ShallowRegionsService;

describe("ShallowRegionsService", function () {
  const createModel = () => new Region(generateRegion(5));
  const baseUrl = "/regions/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ShallowRegionsService],
    });

    this.service = TestBed.inject(ShallowRegionsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
