import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { AudioEventCardComponent } from "./audio-event-card.component";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import "@ecoacoustics/web-components";

describe("AudioEventCardComponent", () => {
  let spectator: Spectator<AudioEventCardComponent>;

  const createComponent = createComponentFactory({
    component: AudioEventCardComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioEventCardComponent);
  });
});
