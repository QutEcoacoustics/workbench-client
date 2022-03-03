import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Response } from "@models/Response";
import { Study } from "@models/Study";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateResponse } from "@test/fakes/Response";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { ResponsesService } from "./responses.service";

type Model = Response;
type Params = [IdOr<Study>];
type Service = ResponsesService;

describe("ResponsesService", (): void => {
  const createModel = () => new Response(generateResponse({ id: 10 }));
  const baseUrl = "/studies/5/responses/";
  const updateUrl = baseUrl + "10";
  let spec: SpectatorService<ResponsesService>;
  const createService = createServiceFactory({
    service: ResponsesService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Response,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    10,
    5
  );
});
