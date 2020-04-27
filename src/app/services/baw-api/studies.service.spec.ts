import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Study } from "@models/Study";
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
import { StudiesService } from "./studies.service";

describe("StudiesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        StudiesService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(StudiesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Study, StudiesService>("/studies/");
  validateApiFilter<Study, StudiesService>("/studies/filter");
  validateApiShow<Study, StudiesService>("/studies/5", 5, new Study({ id: 5 }));
  validateApiCreate<Study, StudiesService>("/studies/", new Study({ id: 5 }));
  validateApiUpdate<Study, StudiesService>("/studies/5", new Study({ id: 5 }));
  validateApiDestroy<Study, StudiesService>(
    "/studies/5",
    5,
    new Study({ id: 5 })
  );
});
