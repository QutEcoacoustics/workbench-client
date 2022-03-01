import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Dataset } from "@models/Dataset";
import { DatasetItem } from "@models/DatasetItem";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateDatasetItem } from "@test/fakes/DatasetItem";
import { validateImmutableApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
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
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
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
    5
  );
});
