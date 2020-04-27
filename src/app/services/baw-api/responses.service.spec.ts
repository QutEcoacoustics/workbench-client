import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Response } from "@models/Response";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { ResponsesService } from "./responses.service";

describe("ResponsesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        ResponsesService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(ResponsesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
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
    new Response({ id: 10 }),
    5
  );
  validateApiCreate<Response, ResponsesService>(
    "/studies/5/responses/",
    new Response({ id: 10 }),
    5
  );
  validateApiUpdate<Response, ResponsesService>(
    "/studies/5/responses/10",
    new Response({ id: 10 }),
    5
  );
  validateApiDestroy<Response, ResponsesService>(
    "/studies/5/responses/10",
    10,
    new Response({ id: 10 }),
    5
  );
});
