import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Dataset } from "@models/Dataset";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateDataset } from "@test/fakes/Dataset";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
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

  validateApiList<Dataset, DatasetsService>("/datasets/");
  validateApiFilter<Dataset, DatasetsService>("/datasets/filter");
  validateApiShow<Dataset, DatasetsService>(
    "/datasets/5",
    5,
    new Dataset(generateDataset(5))
  );
  validateApiCreate<Dataset, DatasetsService>(
    "/datasets/",
    new Dataset(generateDataset(5))
  );
  validateApiUpdate<Dataset, DatasetsService>(
    "/datasets/5",
    new Dataset(generateDataset(5))
  );
  validateApiDestroy<Dataset, DatasetsService>(
    "/datasets/5",
    5,
    new Dataset(generateDataset(5))
  );
});
