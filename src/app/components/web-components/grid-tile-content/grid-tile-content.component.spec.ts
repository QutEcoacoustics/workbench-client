import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { getElementByInnerText } from "@test/helpers/html";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { MediaService } from "@services/media/media.service";
import { MEDIA } from "@baw-api/ServiceTokens";
import { AnnotationService } from "@services/models/annotation.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { patchSharedArrayBuffer } from "src/patches/tests/testPatches";
import { detectChanges } from "@test/helpers/changes";
import { testAsset } from "@test/helpers/karma";
import { GridTileContentComponent } from "./grid-tile-content.component";

describe("GridTileContentComponent", () => {
  let spectator: Spectator<GridTileContentComponent>;

  let mediaServiceSpy: SpyObject<MediaService>;
  let contextRequestSpy: jasmine.Spy;

  let mockAnnotation: Annotation;
  let mockAudioRecording: AudioRecording;

  const createComponent = createComponentFactory({
    component: GridTileContentComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({
      detectChanges: false,
      providers: [
        {
          provide: AnnotationService,
          useValue: { show: () => mockAnnotation },
        },
      ],
    });

    mediaServiceSpy = spectator.inject(MEDIA.token);

    // I hard code the audio recording duration and event start/end times so
    // that I know the audio event will neatly fit within the audio recording
    // when context is added
    mockAudioRecording = new AudioRecording(
      generateAudioRecording({
        durationSeconds: 600,
      })
    );

    mockAudioRecording.getSplittableUrl = jasmine
      .createSpy("getSplittableUrl")
      .and.returnValue(testAsset("example.flac"));

    mockAnnotation = new Annotation(
      generateAnnotation({
        startTimeSeconds: 60,
        endTimeSeconds: 120,
        audioRecording: mockAudioRecording,
        audioRecordingId: mockAudioRecording.id,
      }),
      mediaServiceSpy
    );

    updateContext(mockAnnotation);
  }

  function updateContext(model: Annotation): void {
    spectator.component.handleContextChange({ subject: model } as any);

    contextRequestSpy = jasmine.createSpy("event");
    spectator.component.elementRef.nativeElement.addEventListener("context-request", contextRequestSpy);

    spectator.detectChanges();
  }

  const listenLink = () => getElementByInnerText(spectator, "Go To Source");
  const contextButton = () => getElementByInnerText(spectator, "Show More");
  const contextCloseButton = () => spectator.query("#close-btn");
  const contextCard = () => spectator.query(".context-card");
  const spectrogram = () =>
    spectator.query<SpectrogramComponent>("oe-spectrogram");

  beforeEach(() => {
    patchSharedArrayBuffer();
    setup();
    detectChanges(spectator);
  });

  it("should create", () => {
    spectator.detectChanges();
    expect(spectator.component).toBeInstanceOf(GridTileContentComponent);
  });

  it("should emit a context request event when loaded", () => {
    expect(contextRequestSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ callback: jasmine.any(Function) })
    );
  });

  describe("listen link", () => {
    it("should have the audio link for the event", () => {
      const expectedHref = mockAnnotation.viewUrl;
      expect(listenLink()).toHaveAttribute("href", expectedHref);
    });

    it("should have the correct audio link if a new subject is provided", () => {
      const newTestSubject = new Annotation(
        generateAnnotation(),
        mediaServiceSpy
      );
      updateContext(newTestSubject);

      const expectedHref = newTestSubject.viewUrl;
      expect(listenLink()).toHaveAttribute("href", expectedHref);
    });
  });

  describe("context card", () => {
    it("should toggle a context card when the context button is clicked", () => {
      spectator.click(contextButton());
      expect(contextCard()).toBeVisible();

      // test that we can close the context card again by clicking the button
      // while the context card is open
      spectator.click(contextButton());
      expect(contextCard()).not.toBeVisible();
    });

    it("should close the context card when the close button is clicked", () => {
      spectator.click(contextButton());
      expect(contextCard()).toBeVisible();

      spectator.click(contextCloseButton());
      expect(contextCard()).not.toBeVisible();
    });

    xit("should be able to play the context card spectrogram", () => {
      spectator.click(contextButton());
    });

    // because we have hard coded the audio recording duration and event
    // start/end times to "nice" value, we know that the context will be neatly
    // added to either size of the audio event
    //
    // padding rounding and overflow is tested in the media service tests and
    // so we don't have to retest the overflow logic here
    it("should have the correct context source", () => {
      spectator.click(contextButton());

      const expectedContextSize = 15;
      const expectedStartOffset = mockAnnotation.startTimeSeconds - expectedContextSize;
      const expectedEndOffset = mockAnnotation.endTimeSeconds + expectedContextSize;
      const expectedOffsetParameters = `?start_offset=${expectedStartOffset}&end_offset=${expectedEndOffset}`;

      const realizedSpectrogramSource = spectrogram().src;

      expect(realizedSpectrogramSource).toContain(expectedOffsetParameters);
    });
  });
});
