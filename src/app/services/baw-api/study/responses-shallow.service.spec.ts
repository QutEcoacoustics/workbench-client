import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Response } from "@models/Response";
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
import { ShallowResponsesService } from "./responses.service";

type Model = Response;
type Params = [];
type Service = ShallowResponsesService;

describe("ShallowResponsesService", function () {
  const createModel = () => new Response(generateResponse(5));
  const baseUrl = "/responses/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ShallowResponsesService],
    });

    this.service = TestBed.inject(ShallowResponsesService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
