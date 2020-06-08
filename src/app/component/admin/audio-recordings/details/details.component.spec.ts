import { Injector } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { humanizeDateTime } from "@shared/detail-view/render-field/render-field.component";
import { SharedModule } from "@shared/shared.module";
import { assertDetailView } from "@test/helpers/detail-view";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { DateTime } from "luxon";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminAudioRecordingComponent } from "./details.component";

describe("AdminAudioRecordingComponent", () => {
  let component: AdminAudioRecordingComponent;
  let fixture: ComponentFixture<AdminAudioRecordingComponent>;
  let injector: Injector;

  function configureTestingModule(
    model: AudioRecording,
    error?: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminAudioRecordingComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { audioRecording: audioRecordingResolvers.show },
            { audioRecording: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAudioRecordingComponent);
    injector = TestBed.inject(Injector);
    const accountsApi = TestBed.inject(ACCOUNT.token);
    const sitesApi = TestBed.inject(SHALLOW_SITE.token);
    component = fixture.componentInstance;

    // Catch associated models
    spyOn(accountsApi, "show").and.callFake(() => {
      const subject = new Subject<User>();
      setTimeout(() => {
        subject.next(new User({ id: 1, userName: "custom username" }));
      }, 0);
      return subject;
    });

    spyOn(sitesApi, "show").and.callFake(() => {
      const subject = new Subject<Site>();
      setTimeout(() => {
        subject.next(new Site({ id: 1, projectIds: [1], name: "custom site" }));
      }, 0);
      return subject;
    });

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }
  }

  it("should create", () => {
    configureTestingModule(
      new AudioRecording({
        id: 1,
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, {
      status: 401,
      message: "Unauthorized",
    } as ApiErrorDetails);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const recordedDate = DateTime.fromISO("2010-01-01T21:00:00.000+15:00", {
      setZone: true,
    });
    const createdAt = DateTime.fromISO("2010-02-01T21:00:00.000+15:00", {
      setZone: true,
    });
    const updatedAt = DateTime.fromISO("2010-03-01T21:00:00.000+15:00", {
      setZone: true,
    });
    const deletedAt = DateTime.fromISO("2010-04-01T21:00:00.000+15:00", {
      setZone: true,
    });
    const notes = {
      relative_path: "ULI25_NEW/Data/ULI25_20190909_043707.wav",
      duration_adjustment_for_overlap: [
        {
          changed_at: "2020-02-04T04:59:16Z",
          overlap_amount: 2.978,
          old_duration: 3597.978,
          new_duration: 3595,
          other_uuid: "938742fc-3fcc-4ba0-85ed-d4137e5079be",
        },
      ],
    };

    beforeEach(fakeAsync(function () {
      const model = new AudioRecording({
        id: 1,
        uuid: "xxxxxxxxxxxxxxx",
        uploaderId: 1,
        recordedDate: recordedDate.toISO(),
        siteId: 1,
        durationSeconds: 6010,
        sampleRateHertz: 44100,
        channels: 2,
        mediaType: "audio/wav",
        dataLengthBytes: 1000000,
        fileHash: "SHA: 2346ad27d7568ba9896f1b7da6b5991251debdf2",
        status: "ready",
        notes,
        creatorId: 1,
        updaterId: 1,
        deleterId: 1,
        createdAt: createdAt.toISO(),
        updatedAt: updatedAt.toISO(),
        deletedAt: deletedAt.toISO(),
        originalFileName: "testing.wav",
        recordedUtcOffset: "+11:00",
      });

      configureTestingModule(model);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      this.fixture = fixture;
    }));

    assertDetailView("Id", "id", "1");
    assertDetailView("Uuid", "uuid", "xxxxxxxxxxxxxxx");
    assertDetailView("Uploader", "uploaderId", "User: custom username (1)");
    assertDetailView(
      "Recorded Date",
      "recordedDate",
      humanizeDateTime(recordedDate)
    );
    assertDetailView("Site", "siteId", "Site: custom site (1)");
    assertDetailView(
      "Duration",
      "durationSeconds",
      "PT1H40M10S (1 hour, 40 minutes, 10 seconds)"
    );
    assertDetailView("Sample Rate Hertz", "sampleRateHertz", "44100");
    assertDetailView("Channels", "channels", "2");
    assertDetailView("Media Type", "mediaType", "audio/wav");
    assertDetailView("Data Length Bytes", "dataLengthBytes", "1000000");
    assertDetailView(
      "File Hash",
      "fileHash",
      "SHA: 2346ad27d7568ba9896f1b7da6b5991251debdf2"
    );
    assertDetailView("Status", "status", "ready");
    assertDetailView("Notes", "notes", JSON.stringify(notes));
    assertDetailView("Creator", "creatorId", "User: custom username (1)");
    assertDetailView("Updater", "updaterId", "User: custom username (1)");
    assertDetailView("Deleter", "deleterId", "User: custom username (1)");
    assertDetailView("Created At", "createdAt", humanizeDateTime(createdAt));
    assertDetailView("Updated At", "updatedAt", humanizeDateTime(updatedAt));
    assertDetailView("Deleted At", "deletedAt", humanizeDateTime(deletedAt));
    assertDetailView("Original File Name", "originalFileName", "testing.wav");
    assertDetailView("Recorded UTC Offset", "recordedUtcOffset", "+11:00");
  });
});
