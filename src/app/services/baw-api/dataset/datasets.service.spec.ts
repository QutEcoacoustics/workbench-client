import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Dataset } from "@models/Dataset";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { DatasetsService } from "./datasets.service";

describe("DatasetsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [DatasetsService],
    });

    this.service = TestBed.inject(DatasetsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Dataset, DatasetsService>("/datasets/");
  validateApiFilter<Dataset, DatasetsService>("/datasets/filter");
  validateApiShow<Dataset, DatasetsService>(
    "/datasets/5",
    5,
    new Dataset({ id: 5 })
  );
  validateApiCreate<Dataset, DatasetsService>(
    "/datasets/",
    new Dataset({ id: 5 })
  );
  validateApiUpdate<Dataset, DatasetsService>(
    "/datasets/5",
    new Dataset({ id: 5 })
  );
  validateApiDestroy<Dataset, DatasetsService>(
    "/datasets/5",
    5,
    new Dataset({ id: 5 })
  );
});
