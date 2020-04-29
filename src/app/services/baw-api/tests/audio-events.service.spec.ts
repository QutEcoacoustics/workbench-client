import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioEvent } from "@models/AudioEvent";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { AudioEventsService } from "../audio-events.service";
import { BawApiService } from "../baw-api.service";
import { MockBawApiService } from "../mock/baseApiMock.service";

describe("AudioEventsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AudioEventsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AudioEventsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/",
    undefined,
    5
  );
  validateApiFilter<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/10",
    10,
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiCreate<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/",
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiUpdate<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/10",
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiDestroy<AudioEvent, AudioEventsService>(
    "/audio_recordings/5/audio_events/10",
    10,
    new AudioEvent({ id: 10 }),
    5
  );
});
