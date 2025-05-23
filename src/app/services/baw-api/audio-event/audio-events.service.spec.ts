import { IdOr } from "@baw-api/api-common";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { AudioEventsService } from "./audio-events.service";

type Model = AudioEvent;
type Params = [IdOr<AudioRecording>];
type Service = AudioEventsService;

describe("AudioEventsService", () => {
  const createModel = () => new AudioEvent(generateAudioEvent({ id: 10 }));
  const baseUrl = "/audio_recordings/5/audio_events/";
  const updateUrl = baseUrl + "10";
  let spec: SpectatorService<AudioEventsService>;

  const createService = createServiceFactory({
    service: AudioEventsService,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    AudioEvent,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    10,
    5
  );
});
