import { RouterTestingModule } from "@angular/router/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AudioRecording } from "@models/AudioRecording";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { AdminAudioRecordingsComponent } from "./list.component";

describe("AdminAudioRecordingsComponent", () => {
  let api: AudioRecordingsService;
  let defaultModels: AudioRecording[];
  let spec: Spectator<AdminAudioRecordingsComponent>;
  const createComponent = createComponentFactory({
    component: AdminAudioRecordingsComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  beforeEach(function () {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(AudioRecordingsService);

    defaultModels = [];
    for (let i = 0; i < defaultApiPageSize; i++) {
      defaultModels.push(new AudioRecording(generateAudioRecording()));
    }

    this.defaultModels = defaultModels;
    this.fixture = spec.fixture;
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<AudioRecording, AudioRecordingsService>();

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});
