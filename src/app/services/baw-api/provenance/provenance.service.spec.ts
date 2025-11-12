import { Id } from "@interfaces/apiInterfaces";
import { Provenance } from "@models/Provenance";
import { generateProvenance } from "@test/fakes/Provenance";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ProvenanceService } from "./provenance.service";

describe("ProvenanceService", () => {
  const modelId: Id = 5;
  const createModel = () =>
    new Provenance(generateProvenance({ id: modelId }));

  const baseUrl = "/provenance/";
  const updateUrl: string = baseUrl + modelId;
  let spectator: SpectatorService<ProvenanceService>;

  const createService = createServiceFactory({
    service: ProvenanceService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spectator = createService();
  });

  validateStandardApi(
    () => spectator,
    Provenance,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    modelId
  );
});
