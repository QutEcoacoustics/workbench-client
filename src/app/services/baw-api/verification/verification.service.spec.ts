import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { modelData } from "@test/helpers/faker";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { ShallowVerificationService } from "./verification.service";

type Model = Verification;
type Params = [];
type Service = ShallowVerificationService;

describe("ShallowVerificationService", () => {
  const testModelId = modelData.id();
  const createModel = () => new Verification(generateVerification({ id: testModelId }));
  const baseUrl = "/verifications/";
  const updateUrl: string = baseUrl + testModelId;
  let spec: SpectatorService<ShallowVerificationService>;

  const createService = createServiceFactory({
    service: ShallowVerificationService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Verification,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    testModelId,
  );
});
