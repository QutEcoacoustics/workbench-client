import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Response } from "@models/Response";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateResponse } from "@test/fakes/Response";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { ShallowResponsesService } from "./responses.service";

describe("ShallowResponsesService", (): void => {
  const createModel = () => new Response(generateResponse({ id: 5 }));
  const baseUrl = "/responses/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowResponsesService>;
  const createService = createServiceFactory({
    service: ShallowResponsesService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Response,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
