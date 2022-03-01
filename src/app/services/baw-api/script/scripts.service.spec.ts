import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateScript } from "@test/fakes/Script";
import { validateNonDestructableApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";

describe("ScriptsService", function () {
  const createModel = () => new Script(generateScript({ id: 5 }));
  const baseUrl = "/scripts/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ScriptsService>;
  const createService = createServiceFactory({
    service: ScriptsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateNonDestructableApi(
    () => spec,
    Script,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
