import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Harvest } from "@models/Harvest";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateHarvest } from "@test/fakes/Harvest";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { HarvestsService, ShallowHarvestsService } from "./harvest.service";

describe("HarvestsService", () => {
  const harvestId = 10;
  const createModel = () => new Harvest(generateHarvest({ id: harvestId }));
  const baseUrl = "/projects/5/harvest/";
  let spec: SpectatorService<HarvestsService>;
  const createService = createServiceFactory({
    service: HarvestsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [
      BawApiService,
      BawSessionService,
      ShallowHarvestsService,
      mockProvider(ToastrService),
    ],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Harvest,
    baseUrl,
    baseUrl + "filter",
    baseUrl + harvestId,
    createModel,
    harvestId, // harvest
    5 //project
  );
});
