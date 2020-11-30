import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { libraryRoute } from "@components/library/library.menus";
import { LibraryModule } from "@components/library/library.module";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { BehaviorSubject } from "rxjs";
import { AnnotationComponent } from "./details.component";

describe("AnnotationComponent", () => {
  validateBawClientPage(
    libraryRoute,
    AnnotationComponent,
    [LibraryModule],
    "/library/123/audio_events/123",
    "Annotation",
    (spec) => {
      const recordingApi = spec.inject(AudioRecordingsService);
      const eventsApi = spec.inject(AudioEventsService);

      recordingApi.show.andCallFake(
        (modelId) =>
          new BehaviorSubject(
            new AudioRecording(generateAudioRecording(modelId))
          )
      );
      eventsApi.show.andCallFake(
        (modelId) =>
          new BehaviorSubject(new AudioEvent(generateAudioEvent(modelId)))
      );
    }
  );
});
