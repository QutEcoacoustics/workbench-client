import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { AudioEventsService } from "./audio-events.service";

type Model = AudioEvent;
type Params = [IdOr<AudioRecording>];
type Service = AudioEventsService;

describe("AudioEventsService", function () {
  const createModel = () => new AudioEvent(generateAudioEvent({ id: 10 }));
  const baseUrl = "/audio_recordings/5/audio_events/";
  const updateUrl = baseUrl + "10";
  const createService = createServiceFactory({
    service: AudioEventsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(updateUrl, 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel, 5);
  validateApiDestroy<Model, Params, Service>(updateUrl, 10, createModel, 5);
});
