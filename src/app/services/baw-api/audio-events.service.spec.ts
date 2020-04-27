import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioEvent } from "@models/AudioEvent";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { AudioEventsService } from "./audio-events.service";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";

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
    "/analysis_jobs/5/audio_events/",
    undefined,
    5
  );
  validateApiFilter<AudioEvent, AudioEventsService>(
    "/analysis_jobs/5/audio_events/filter",
    undefined,
    undefined,
    5
  );
  validateApiShow<AudioEvent, AudioEventsService>(
    "/analysis_jobs/5/audio_events/10",
    10,
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiCreate<AudioEvent, AudioEventsService>(
    "/analysis_jobs/5/audio_events/",
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiUpdate<AudioEvent, AudioEventsService>(
    "/analysis_jobs/5/audio_events/10",
    new AudioEvent({ id: 10 }),
    5
  );
  validateApiDestroy<AudioEvent, AudioEventsService>(
    "/analysis_jobs/5/audio_events/10",
    10,
    new AudioEvent({ id: 10 }),
    5
  );
});
