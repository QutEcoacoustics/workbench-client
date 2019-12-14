import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { AudioRecordingsService } from "./audio-recordings.service";

describe("AudioRecordingsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [...testAppInitializer]
    })
  );

  it("should be created", () => {
    const service: AudioRecordingsService = TestBed.get(AudioRecordingsService);
    expect(service).toBeTruthy();
  });
});
