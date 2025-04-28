import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { listenRoute } from "@components/listen/listen.menus";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { BehaviorSubject } from "rxjs";
import { ListenRecordingComponent } from "./details.component";

describe("ListenRecordingComponent", () => {
  validateBawClientPage(
    listenRoute,
    ListenRecordingComponent,
    "/listen/123",
    "Download from this item",
    (spec) => {
      const recordingApi = spec.inject(AudioRecordingsService);

      recordingApi.show.andCallFake(
        (id: number) =>
          new BehaviorSubject(
            new AudioRecording(generateAudioRecording({ id }))
          )
      );
    }
  );

  assertPageInfo(ListenRecordingComponent, "Play");
});
