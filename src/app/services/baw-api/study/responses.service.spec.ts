import { IdOr } from "@baw-api/api-common";
import { Response } from "@models/Response";
import { Study } from "@models/Study";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateResponse } from "@test/fakes/Response";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
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
    imports: mockServiceImports,
    providers: mockServiceProviders,
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
    5,
  );
});
