import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioRecordingsListComponent } from "./list.component";

describe("AudioRecordingsListComponent", () => {
  let spectator: Spectator<AudioRecordingsListComponent>;

  const createComponent = createRoutingFactory({
    component: AudioRecordingsListComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
  }

  beforeEach(() => setup());

  assertPageInfo(AudioRecordingsListComponent, "Audio Recordings");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioRecordingsListComponent);
  });
});
