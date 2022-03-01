import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Study } from "@models/Study";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStudy } from "@test/fakes/Study";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { StudiesService } from "./studies.service";

describe("StudiesService", (): void => {
  const createModel = () => new Study(generateStudy({ id: 5 }));
  const baseUrl = "/studies/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<StudiesService>;
  const createService = createServiceFactory({
    service: StudiesService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Study,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
