import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
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
import { ResponsesService } from "./responses.service";

describe("ResponsesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ResponsesService],
    });

    this.service = TestBed.inject(ResponsesService);
  });

  validateApiList<Response, ResponsesService>(
    "/studies/5/responses/",
    undefined,
    5
  );
  validateApiFilter<Response, ResponsesService>(
    "/studies/5/responses/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<Response, ResponsesService>(
    "/studies/5/responses/10",
    10,
    new Response(generateResponse(10)),
    5
  );
  validateApiCreate<Response, ResponsesService>(
    "/studies/5/responses/",
    new Response(generateResponse(10)),
    5
  );
  validateApiUpdate<Response, ResponsesService>(
    "/studies/5/responses/10",
    new Response(generateResponse(10)),
    5
  );
  validateApiDestroy<Response, ResponsesService>(
    "/studies/5/responses/10",
    10,
    new Response(generateResponse(10)),
    5
  );
});
