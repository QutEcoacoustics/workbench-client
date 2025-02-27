import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { modelData } from "@test/helpers/faker";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { mockServiceImports, mockServiceProviders, validateReadonlyApi, validateStandardApi } from "@test/helpers/api-common";
import { IdOr } from "@baw-api/api-common";
import { AudioRecording } from "@models/AudioRecording";
import { AudioEvent } from "@models/AudioEvent";
import { ShallowVerificationService, VerificationService } from "./verification.service";

type Model = Verification;

type Params = [IdOr<AudioRecording>, IdOr<AudioEvent>];
type Service = VerificationService;

type ShallowParams = [];
type ShallowService = ShallowVerificationService;

describe("VerificationService", () => {
  const testModelId = modelData.id();
  const testAudioRecordingId = modelData.id();
  const testAudioEventId = modelData.id();
  const createModel = () => new Verification(generateVerification({
    id: testModelId,
    audioEventId: testAudioEventId,
  }));

  const baseUrl = `/audio_recordings/${testAudioRecordingId}/audio_events/${testAudioEventId}/verifications/`;
  const updateUrl: string = baseUrl + testModelId;
  let spec: SpectatorService<VerificationService>;

  const createService = createServiceFactory({
    service: VerificationService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateReadonlyApi<Model, Params, Service>(
    () => spec,
    Verification,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    testModelId,
    testAudioRecordingId,
    testAudioEventId,
  );
});

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

  validateStandardApi<Model, ShallowParams, ShallowService>(
    () => spec,
    Verification,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    testModelId,
  );
});
