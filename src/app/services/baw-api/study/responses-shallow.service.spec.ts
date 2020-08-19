import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Response } from "@models/Response";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { ShallowResponsesService } from "./responses.service";

describe("ShallowResponsesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ShallowResponsesService],
    });

    this.service = TestBed.inject(ShallowResponsesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Response, ShallowResponsesService>("/responses/");
  validateApiFilter<Response, ShallowResponsesService>("/responses/filter");
  validateApiShow<Response, ShallowResponsesService>(
    "/responses/5",
    5,
    new Response({ id: 5 })
  );
  validateApiCreate<Response, ShallowResponsesService>(
    "/responses/",
    new Response({ id: 5 })
  );
  validateApiUpdate<Response, ShallowResponsesService>(
    "/responses/5",
    new Response({ id: 5 })
  );
  validateApiDestroy<Response, ShallowResponsesService>(
    "/responses/5",
    5,
    new Response({ id: 5 })
  );
});
