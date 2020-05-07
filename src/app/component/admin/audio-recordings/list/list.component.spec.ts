import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { SharedModule } from "@shared/shared.module";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { testBawServices } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { AdminAudioRecordingsComponent } from "./list.component";

describe("AdminAudioRecordingsComponent", () => {
  let api: AudioRecordingsService;
  let defaultAudioRecording: AudioRecording;
  let defaultAudioRecordings: AudioRecording[];
  let fixture: ComponentFixture<AdminAudioRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminAudioRecordingsComponent],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminAudioRecordingsComponent);
    api = TestBed.inject(AudioRecordingsService);

    defaultAudioRecording = new AudioRecording({
      id: 1,
      siteId: 1,
      durationSeconds: 3000,
      recordedDate: "2020-03-09T22:00:50.072+10:00",
    });
    defaultAudioRecordings = [];
    for (let i = 0; i < 25; i++) {
      defaultAudioRecordings.push(
        new AudioRecording({
          id: i,
          siteId: 1,
          durationSeconds: 3000,
          recordedDate: "2020-03-09T22:00:50.072+10:00",
        })
      );
    }

    this.defaultModels = defaultAudioRecordings;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<AudioRecording, AudioRecordingsService>();

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
