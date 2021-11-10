import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Dataset } from "@models/Dataset";
import { createServiceFactory } from "@ngneat/spectator";
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
  const createModel = () => new Dataset(generateDataset({ id: 5 }));
  const baseUrl = "/datasets/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: DatasetsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel);
  validateApiDestroy<Model, Params, Service>(updateUrl, 5, createModel);
});
