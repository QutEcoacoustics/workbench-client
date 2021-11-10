import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { AdminAudioRecordingComponent } from "./details.component";

describe("AdminAudioRecordingComponent", () => {
  let injector: Injector;
  let spec: Spectator<AdminAudioRecordingComponent>;
  const createComponent = createComponentFactory({
    component: AdminAudioRecordingComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  function setup(model: AudioRecording, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { audioRecording: audioRecordingResolvers.show },
            { audioRecording: { model, error } }
          ),
        },
      ],
    });

    injector = spec.inject(Injector);
    const accountsApi = spec.inject(ACCOUNT.token);
    const sitesApi = spec.inject(SHALLOW_SITE.token);

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
    accountsApi.show.and.callFake(() => accountsSubject);
    sitesApi.show.and.callFake(() => siteSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  it("should create", () => {
    setup(new AudioRecording(generateAudioRecording()));
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should handle error", () => {
    setup(undefined, generateApiErrorDetails());
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("details", () => {
    const model = new AudioRecording(generateAudioRecording());

    beforeEach(async function () {
      const promise = setup(model);
      spec.detectChanges();
      await promise;
      spec.detectChanges();
      this.fixture = spec.fixture;
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
