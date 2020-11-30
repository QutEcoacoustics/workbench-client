import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Response } from "@models/Response";
import { Study } from "@models/Study";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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
  const createModel = () => new Response(generateResponse(10));
  const baseUrl = "/studies/5/responses/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ResponsesService],
    });

    this.service = TestBed.inject(ResponsesService);
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
});
