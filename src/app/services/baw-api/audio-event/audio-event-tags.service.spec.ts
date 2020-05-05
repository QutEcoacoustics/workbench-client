import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioEventTag } from "@models/AudioEventTag";
import { validateApiFilter } from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { BawApiService } from "../baw-api.service";
import { MockBawApiService } from "../mock/baseApiMock.service";
import { AudioEventTagsService } from "./audio-event-tags.service";

describe("AudioEventTagsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AudioEventTagsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AudioEventTagsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiFilter<AudioEventTag, AudioEventTagsService>(
    "/audio_recordings/5/audio_events/10/tags/filter",
    undefined,
    undefined,
    5,
    10
  );
});
