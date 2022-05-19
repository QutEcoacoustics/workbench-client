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
import { ShallowHarvestItemsService } from "./harvest-items.service";

describe("ShallowHarvestItemsService", () => {
  const harvestItemId = 10;
  const createModel = () =>
    new HarvestItem(generateHarvestItem({ id: harvestItemId }));
  const baseUrl = "/harvest/5/harvest_items/";
  const showUrl = baseUrl + harvestItemId;
  let spec: SpectatorService<ShallowHarvestItemsService>;
  const createService = createServiceFactory({
    service: ShallowHarvestItemsService,
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
    showUrl,
    createModel,
    harvestItemId, // harvest item
    5 // harvest
  );
});
