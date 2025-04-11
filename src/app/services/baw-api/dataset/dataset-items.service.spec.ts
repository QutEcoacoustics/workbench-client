import { IdOr } from "@baw-api/api-common";
import { Dataset } from "@models/Dataset";
import { DatasetItem } from "@models/DatasetItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateDatasetItem } from "@test/fakes/DatasetItem";
import { mockServiceImports, mockServiceProviders, validateImmutableApi } from "@test/helpers/api-common";
import { DatasetItemsService } from "./dataset-items.service";

type Model = DatasetItem;
type Params = [IdOr<Dataset>];
type Service = DatasetItemsService;

describe("DatasetItemsService", (): void => {
  const createModel = () => new DatasetItem(generateDatasetItem({ id: 10 }));
  const baseUrl = "/datasets/5/items/";
  const updateUrl = baseUrl + "10";
  let spec: SpectatorService<DatasetItemsService>;
  const createService = createServiceFactory({
    service: DatasetItemsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateImmutableApi<Model, Params, Service>(
    () => spec,
    DatasetItem,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    10,
    5,
  );
});
