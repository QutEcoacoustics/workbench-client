import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Response } from "@models/Response";
import { Study } from "@models/Study";
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
import { ResponsesService } from "./responses.service";

type Model = Response;
type Params = [IdOr<Study>];
type Service = ResponsesService;

describe("ResponsesService", function () {
  const createModel = () => new Response(generateResponse({ id: 10 }));
  const baseUrl = "/studies/5/responses/";
  const updateUrl = baseUrl + "10";
  const createService = createServiceFactory({
    service: ResponsesService,
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
