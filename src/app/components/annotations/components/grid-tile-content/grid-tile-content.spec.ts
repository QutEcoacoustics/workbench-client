import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AudioEvent } from "@models/AudioEvent";
import { ContextRequestEvent } from "@helpers/context/context";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { GridTileContentComponent } from "./grid-tile-content.component";

describe("GridTileContentComponent", () => {
  let spectator: Spectator<GridTileContentComponent>;
  let mockAudioEvent: AudioEvent;

  const createComponent = createComponentFactory({
    component: GridTileContentComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
  }

  const listenLink = () => spectator.query<HTMLAnchorElement>("listen-link");
  const contextLink = () => spectator.query<HTMLAnchorElement>("context-link");

  beforeEach(() => {
    mockAudioEvent = new AudioEvent(generateAudioEvent());
    setup();
  });

  it("should create", () => {
    spectator.detectChanges();
    expect(spectator.component).toBeInstanceOf(GridTileContentComponent);
  });

  it("should emit an event request for a context", () => {
    let contextEvent: ContextRequestEvent<any>;

    spectator.output("context-request" as any).subscribe((result: any) => (contextEvent = result));
    spectator.detectChanges();

    expect(contextEvent).toEqual(
      jasmine.objectContaining({
        callback: spectator.component.handleContextChange
      }),
    );
  });

  it("should have the correct content for the audio model", () => {
    spectator.detectChanges();
    const listenLinkElement = listenLink();
    expect(listenLinkElement).toHaveHref(mockAudioEvent.viewUrl);
    expect(listenLinkElement).toHaveText(mockAudioEvent.viewUrl);

    const contextLinkElement = contextLink();
    expect(contextLinkElement).toHaveHref(mockAudioEvent.viewUrl);
    expect(contextLinkElement).toHaveText(mockAudioEvent.viewUrl);
  });
});
