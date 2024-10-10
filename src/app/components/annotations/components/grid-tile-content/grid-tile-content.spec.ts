import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { getElementByInnerText } from "@test/helpers/html";
import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { GridTileContentComponent } from "./grid-tile-content.component";

describe("GridTileContentComponent", () => {
  let spectator: Spectator<GridTileContentComponent>;
  let contextRequestSpy: jasmine.Spy;
  let mockVerification: Verification;

  const createComponent = createComponentFactory({
    component: GridTileContentComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    updateContext(mockVerification);
  }

  function updateContext(model: Verification): void {
    spectator.component.handleContextChange({ subject: model } as any);

    contextRequestSpy = jasmine.createSpy("event");
    contentWrapper().addEventListener("context-request", contextRequestSpy);

    spectator.detectChanges();
  }

  const listenLink = () => getElementByInnerText(spectator, "Go To Source");
  const contextButton = () => getElementByInnerText(spectator, "Show More");
  const contextCard = () => spectator.query(".context-card");
  const contentWrapper = () => spectator.query(".content-wrapper");
  const spectrogram = () =>
    spectator.query<SpectrogramComponent>("oe-spectrogram");

  beforeEach(() => {
    mockVerification = new Verification(
      generateVerification({
        audioLink:
          "https://test.com/audio.mp3?audio_event_id=1&start_offset=0&end_offset=10",
      })
    );

    setup();
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
      const expectedHref = mockVerification.viewUrl;
      expect(listenLink()).toHaveAttribute("href", expectedHref);
    });

    it("should have the correct audio link if a new subject is provided", () => {
      const newTestSubject = new Verification(generateVerification());
      updateContext(newTestSubject);

      const expectedHref = newTestSubject.viewUrl;
      expect(listenLink()).toHaveAttribute("href", expectedHref);
    });
  });

  describe("context card", () => {
    it("should toggle a context card when the context button is clicked", () => {
      spectator.click(contextButton());
      expect(contextCard()).toBeVisible();
    });

    xit("should be able to play the context card spectrogram", () => {
      spectator.click(contextButton());
    });

    it("should have the correct context source", () => {
      spectator.click(contextButton());

      const expectedBase = "https://test.com/audio.mp3";
      const expectedStartOffset = mockVerification.startTimeSeconds - 30;
      const expectedEndOffset = mockVerification.endTimeSeconds + 30;
      const expectedSpectrogramSource = `${expectedBase}?start_offset=${expectedStartOffset}&end_offset=${expectedEndOffset}`;

      const realizedSpectrogramSource = spectrogram().src;

      expect(realizedSpectrogramSource).toEqual(expectedSpectrogramSource);
    });

    // if the audio event is at the start of the recording, we limit the context to the end of the recording (0 seconds)
    // because if we subtract 30 seconds from 0, we get -30 seconds, which is invalid
    it("should have the correct context source if the audio event is at the start of the recording", () => {
      const testVerification = new Verification(
        generateVerification({
          startTimeSeconds: 0,
          endTimeSeconds: 10,
          audioLink:
            "https://test.com/audio.mp3?audio_event_id=1&start_offset=0&end_offset=10",
        })
      );
      updateContext(testVerification);

      spectator.click(contextButton());

      const expectedSpectrogramSource = "https://test.com/audio.mp3?start_offset=0&end_offset=40";
      const realizedSpectrogramSource = spectrogram().src;

      expect(realizedSpectrogramSource).toEqual(expectedSpectrogramSource);
    });
  });
});
