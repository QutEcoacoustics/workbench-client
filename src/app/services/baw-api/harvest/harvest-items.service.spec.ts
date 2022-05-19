import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { HarvestItem } from "@models/HarvestItem";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import { validateReadonlyApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { HarvestItemsService } from "./harvest-items.service";

describe("HarvestItemsService", () => {
  const harvestItemId = 15;
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ id: harvestItemId }));
  const baseUrl = "/projects/5/harvest/10/harvest_items/";
  let spec: SpectatorService<HarvestItemsService>;
  const createService = createServiceFactory({
    service: HarvestItemsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi(
    () => spec,
    HarvestItem,
    baseUrl,
    baseUrl + "filter",
    baseUrl + harvestItemId,
    createModel,
    harvestItemId, // harvest item
    5, // project
    10, // harvest
  );
});
