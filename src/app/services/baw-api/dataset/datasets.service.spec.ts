import { Dataset } from "@models/Dataset";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateDataset } from "@test/fakes/Dataset";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { DatasetsService } from "./datasets.service";

describe("DatasetsService", (): void => {
  const createModel = () => new Dataset(generateDataset({ id: 5 }));
  const baseUrl = "/datasets/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<DatasetsService>;
  const createService = createServiceFactory({
    service: DatasetsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(() => spec, Dataset, baseUrl, baseUrl + "filter", updateUrl, createModel, 5);
});
