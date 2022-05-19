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
import { ShallowHarvestsService } from "./harvest.service";

describe("ShallowHarvestsService", () => {
  const harvestId = 5;
  const createModel = () => new Harvest(generateHarvest({ id: harvestId }));
  const baseUrl = "/harvest/";
  const showUrl = baseUrl + harvestId;
  let spec: SpectatorService<ShallowHarvestsService>;
  const createService = createServiceFactory({
    service: ShallowHarvestsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Harvest,
    baseUrl,
    baseUrl + "filter",
    showUrl,
    createModel,
    harvestId
  );

  // TODO Implement tests
  xdescribe("transitionState", () => {});

  xdescribe("updateMappings", () => {});
});
