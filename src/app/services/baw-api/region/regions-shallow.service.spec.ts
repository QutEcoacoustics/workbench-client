import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Region } from "@models/Region";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateRegion } from "@test/fakes/Region";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { ShallowRegionsService } from "./regions.service";

describe("ShallowRegionsService", function () {
  const createModel = () => new Region(generateRegion({ id: 5 }));
  const baseUrl = "/regions/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowRegionsService>;
  const createService = createServiceFactory({
    service: ShallowRegionsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Region,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
