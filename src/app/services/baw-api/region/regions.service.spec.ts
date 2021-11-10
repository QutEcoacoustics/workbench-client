import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Project } from "@models/Project";
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
import { RegionsService } from "./regions.service";

type Model = Region;
type Params = [IdOr<Project>];
type Service = RegionsService;

describe("RegionsService", function () {
  const createModel = () => new Region(generateRegion({ id: 10 }));
  const baseUrl = "/projects/5/regions/";
  const updateUrl = baseUrl + "10";
  const createService = createServiceFactory({
    service: RegionsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(updateUrl, 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel, 5);
  validateApiDestroy<Model, Params, Service>(updateUrl, 10, createModel, 5);
});
