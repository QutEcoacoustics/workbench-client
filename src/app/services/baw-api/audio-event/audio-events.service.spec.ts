import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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
  const createModel = () => new AudioEvent(generateAudioEvent(10));
  const baseUrl = "/audio_recordings/5/audio_events/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [AudioEventsService],
    });

    this.service = TestBed.inject(AudioEventsService);
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(baseUrl + "10", createModel, 5);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "10",
    10,
    createModel,
    5
  );
});
