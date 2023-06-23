import { Id } from "@interfaces/apiInterfaces";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { AudioEventProvenanceService } from "./AudioEventProvenance.service";

describe("AudioEventProvenanceService", () => {
  const modelId: Id = 5;
  const createModel = () =>
    new AudioEventProvenance(generateAudioEventProvenance({ id: modelId }));

  const baseUrl = "/provenance/";
  const updateUrl: string = baseUrl + modelId;
  let spectator: SpectatorService<AudioEventProvenanceService>;

  const createService = createServiceFactory({
    service: AudioEventProvenanceService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spectator = createService();
  });

  validateStandardApi(
    () => spectator,
    AudioEventProvenance,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    modelId
  );
});
