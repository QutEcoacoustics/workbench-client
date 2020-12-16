import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Dataset } from "@models/Dataset";
import { DatasetItem } from "@models/DatasetItem";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateDatasetItem } from "@test/fakes/DatasetItem";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";
import { DatasetItemsService } from "./dataset-items.service";

type Model = DatasetItem;
type Params = [IdOr<Dataset>];
type Service = DatasetItemsService;

describe("DatasetItemsService", function () {
  const createModel = () => new DatasetItem(generateDatasetItem(10));
  const baseUrl = "/datasets/5/items/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [DatasetItemsService],
    });

    this.service = TestBed.inject(DatasetItemsService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "10",
    10,
    createModel,
    5
  );
});
