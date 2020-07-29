import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
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

    const accountsSubject = new Subject<User>();
    const siteSubject = new Subject<Site>();
    const promise = Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User({ id: 1, userName: "custom username" })
      ),
      nStepObservable(
        siteSubject,
        () => new Site({ id: 1, projectIds: [1], name: "custom site" })
      ),
    ]);

    // Catch associated models
    spyOn(accountsApi, "show").and.callFake(() => accountsSubject);
    spyOn(sitesApi, "show").and.callFake(() => siteSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  it("should create", () => {
    configureTestingModule(new AudioRecording(generateAudioRecording()));
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
    const model = new AudioRecording(generateAudioRecording());

    beforeEach(async function () {
      const promise = configureTestingModule(model);
      fixture.detectChanges();
      await promise;
      fixture.detectChanges();
      this.fixture = fixture;
    });

    const details: Detail[] = [
      { label: "Id", key: "id", plain: model.id },
      { label: "Uuid", key: "uuid", plain: model.uuid },
      {
        label: "Uploader",
        key: "uploader",
        model: "User: custom username (1)",
      },
      {
        label: "Recorded Date",
        key: "recordedDate",
        plain: model.recordedDate,
      },
      { label: "Site", key: "site", model: "Site: custom site (1)" },
      { label: "Duration", key: "duration", plain: model.duration },
      {
        label: "Sample Rate Hertz",
        key: "sampleRateHertz",
        plain: model.sampleRateHertz,
      },
      { label: "Channels", key: "channels", plain: model.channels },
      { label: "Media Type", key: "mediaType", plain: model.mediaType },
      {
        label: "Data Length Bytes",
        key: "dataLengthBytes",
        plain: model.dataLengthBytes,
      },
      { label: "File Hash", key: "fileHash", plain: model.fileHash },
      { label: "Status", key: "status", plain: model.status },
      { label: "Notes", key: "notes", code: model.notes },
      { label: "Creator", key: "creator", model: "User: custom username (1)" },
      { label: "Updater", key: "updater", model: "User: custom username (1)" },
      { label: "Deleter", key: "deleter", model: "User: custom username (1)" },
      { label: "Created At", key: "createdAt", plain: model.createdAt },
      { label: "Updated At", key: "updatedAt", plain: model.updatedAt },
      { label: "Deleted At", key: "deletedAt", plain: model.deletedAt },
      {
        label: "Original File Name",
        key: "originalFileName",
        plain: model.originalFileName,
      },
      {
        label: "Recorded UTC Offset",
        key: "recordedUtcOffset",
        plain: model.recordedUtcOffset,
      },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
