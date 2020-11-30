import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { listenRoute } from "@components/listen/listen.menus";
import { ListenModule } from "@components/listen/listen.module";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { BehaviorSubject } from "rxjs";
import { ListenRecordingComponent } from "./details.component";

describe("ListenRecordingComponent", () => {
  validateBawClientPage(
    listenRoute,
    ListenRecordingComponent,
    [ListenModule],
    "/listen/123",
    "Download from this item",
    (spec) => {
      const recordingApi = spec.inject(AudioRecordingsService);

      recordingApi.show.andCallFake(
        (modelId) =>
          new BehaviorSubject(
            new AudioRecording(generateAudioRecording(modelId))
          )
      );
    }
  );
});
