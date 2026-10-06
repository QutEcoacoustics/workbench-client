import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { listenRoute } from "@components/listen/listen.menus";
import { compileAndSplitRoutes } from "@helpers/page/pageRouting";
import { AudioRecording } from "@models/AudioRecording";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
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

  describe("start time clamping", () => {
    let spec: SpectatorRouting<ListenRecordingComponent>;
    const [clientRoutes] = compileAndSplitRoutes([listenRoute]);

    const createComponent = createRoutingFactory({
      component: ListenRecordingComponent,
      providers: [provideMockBawApi()],
      routes: clientRoutes,
      stubsEnabled: false,
    });

    async function setup(url: string): Promise<void> {
      spec = createComponent();

      const recordingApi = spec.inject(AudioRecordingsService);
      recordingApi.show.andCallFake(
        (id: number) =>
          new BehaviorSubject(
            new AudioRecording(
              generateAudioRecording({ id, durationSeconds: 3600 }),
            ),
          ),
      );

      await spec.router.navigateByUrl(url);
      await spec.fixture.whenStable();
    }

    it("should clamp a start time that would load audio past the end of the recording", async () => {
      await setup("/listen/123?start=3590");
      expect(spec.router.url).toEqual("/listen/123?start=3570");
    });

    it("should not change a start time inside the recording", async () => {
      await setup("/listen/123?start=3570");
      expect(spec.router.url).toEqual("/listen/123?start=3570");
    });
  });
});
