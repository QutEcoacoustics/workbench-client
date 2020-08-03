import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioRecording } from "@models/AudioRecording";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "src/app/test/helpers/api-common";
import { AudioRecordingsService } from "./audio-recordings.service";

describe("AudioRecordingsService", function () {
  beforeEach(async(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AudioRecordingsService],
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
