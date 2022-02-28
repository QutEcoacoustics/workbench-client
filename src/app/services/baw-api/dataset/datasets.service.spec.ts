import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Dataset } from "@models/Dataset";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateDataset } from "@test/fakes/Dataset";
import { validateStandardApi } from "@test/helpers/api-common";
import { DatasetsService } from "./datasets.service";

describe("DatasetsService", (): void => {
  const createModel = () => new Dataset(generateDataset({ id: 5 }));
  const baseUrl = "/datasets/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<DatasetsService>;
  const createService = createServiceFactory({
    service: DatasetsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    spec,
    Dataset,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
