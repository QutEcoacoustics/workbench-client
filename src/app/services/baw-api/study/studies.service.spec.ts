import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Study } from "@models/Study";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStudy } from "@test/fakes/Study";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { StudiesService } from "./studies.service";

type Model = Study;
type Params = [];
type Service = StudiesService;

describe("StudiesService", function () {
  const createModel = () => new Study(generateStudy({ id: 5 }));
  const baseUrl = "/studies/";
  const createService = createServiceFactory({
    service: StudiesService,
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
});
