import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Dataset } from "@models/Dataset";
import { MockAppConfigModule } from "@services/config/configMock.module";
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

type Model = Dataset;
type Params = [];
type Service = DatasetsService;

describe("DatasetsService", function () {
  const createModel = () => new Dataset(generateDataset(5));
  const baseUrl = "/datasets/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [DatasetsService],
    });

    this.service = TestBed.inject(DatasetsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
