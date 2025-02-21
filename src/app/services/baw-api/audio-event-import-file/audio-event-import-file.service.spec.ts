import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import { mockServiceImports, mockServiceProviders, validateImmutableApi } from "@test/helpers/api-common";
import { AudioEventImport } from "@models/AudioEventImport";
import { IdOr } from "@baw-api/api-common";
import { AudioEventImportFileService } from "./audio-event-import-file.service";

type Model = AudioEventImportFile;
type Params = [IdOr<AudioEventImport>];
type Service = AudioEventImportFileService;

describe("AudioEventImportFIleService", () => {
  let spec: SpectatorService<AudioEventImportFileService>;

  const mockEventImportId = modelData.id();
  const mockModelId = modelData.id();
  const baseUrl = `/audio_event_imports/${mockEventImportId}/files/`;
  const updateUrl = baseUrl + mockModelId;
  const createModel = () => new AudioEventImportFile(
    generateAudioEventImportFile({
      id: mockModelId,
      audioEventImportId: mockEventImportId,
    })
  );

  const createService = createServiceFactory({
    service: AudioEventImportFileService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateImmutableApi<Model, Params, Service>(
    () => spec,
    AudioEventImportFile,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    mockModelId,
    mockEventImportId
  );
});
