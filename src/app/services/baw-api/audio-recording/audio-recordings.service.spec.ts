import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { MockBawApiService } from "@baw-api/mock/baseApiMock.service";
import { AudioRecording } from "@models/AudioRecording";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { AudioRecordingsService } from "./audio-recordings.service";

describe("AudioRecordingsService", function () {
  beforeEach(async(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AudioRecordingsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });
    this.service = TestBed.inject(AudioRecordingsService);
  }));

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<AudioRecording, AudioRecordingsService>("/audio_recordings/");
  validateApiFilter<AudioRecording, AudioRecordingsService>(
    "/audio_recordings/filter"
  );
  validateApiShow<AudioRecording, AudioRecordingsService>(
    "/audio_recordings/5",
    5,
    new AudioRecording({ id: 5 })
  );
});
