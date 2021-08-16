import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Response } from "@models/Response";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateResponse } from "@test/fakes/Response";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { ShallowResponsesService } from "./responses.service";

type Model = Response;
type Params = [];
type Service = ShallowResponsesService;

describe("ShallowResponsesService", function () {
  const createModel = () => new Response(generateResponse({ id: 5 }));
  const baseUrl = "/responses/";
  const createService = createServiceFactory({
    service: ShallowResponsesService,
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
