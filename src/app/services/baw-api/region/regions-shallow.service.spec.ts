import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Region } from "@models/Region";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
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
  const createModel = () => new Region(generateRegion({ id: 5 }));
  const baseUrl = "/regions/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: ShallowRegionsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel);
  validateApiDestroy<Model, Params, Service>(updateUrl, 5, createModel);
});
