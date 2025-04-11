import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { AudioEventImport } from "@models/AudioEventImport";
import { modelData } from "@test/helpers/faker";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { AudioEventImportService } from "./audio-event-import.service";

type Model = AudioEventImport;
type Params = [];
type Service = AudioEventImportService;

describe("AudioEventImportService", () => {
  let spec: SpectatorService<AudioEventImportService>;

  const mockModelId = modelData.id();
  const baseUrl = "/audio_event_imports/";
  const updateUrl = baseUrl + mockModelId;
  const createModel = () => new AudioEventImport(generateAudioEventImport({ id: mockModelId }));

  const createService = createServiceFactory({
    service: AudioEventImportService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    AudioEventImport,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    mockModelId,
  );
});
