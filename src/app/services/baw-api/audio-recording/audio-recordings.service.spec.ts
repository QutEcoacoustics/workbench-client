import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { AudioRecordingsService } from "./audio-recordings.service";

type Model = AudioRecording;
type Params = [];
type Service = AudioRecordingsService;

describe("AudioRecordingsService", function () {
  const createModel = () =>
    new AudioRecording(generateAudioRecording({ id: 5 }));
  const baseUrl = "/audio_recordings/";
  const createService = createServiceFactory({
    service: AudioRecordingsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<Site>], Service>(
    baseUrl + "filter",
    "filterBySite",
    { filter: { siteId: { eq: 5 } } },
    undefined,
    5
  );
});
