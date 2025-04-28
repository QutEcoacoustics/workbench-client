import { Response } from "@models/Response";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateResponse } from "@test/fakes/Response";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ShallowResponsesService } from "./responses.service";

describe("ShallowResponsesService", (): void => {
  const createModel = () => new Response(generateResponse({ id: 5 }));
  const baseUrl = "/responses/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ShallowResponsesService>;

  const createService = createServiceFactory({
    service: ShallowResponsesService,
    providers: mockServiceProviders,
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
