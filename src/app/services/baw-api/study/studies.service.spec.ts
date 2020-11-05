import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Study } from "@models/Study";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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

describe("StudiesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [StudiesService],
    });

    this.service = TestBed.inject(StudiesService);
  });

  validateApiList<Study, StudiesService>("/studies/");
  validateApiFilter<Study, StudiesService>("/studies/filter");
  validateApiShow<Study, StudiesService>(
    "/studies/5",
    5,
    new Study(generateStudy(5))
  );
  validateApiCreate<Study, StudiesService>(
    "/studies/",
    new Study(generateStudy(5))
  );
  validateApiUpdate<Study, StudiesService>(
    "/studies/5",
    new Study(generateStudy(5))
  );
  validateApiDestroy<Study, StudiesService>(
    "/studies/5",
    5,
    new Study(generateStudy(5))
  );
});
