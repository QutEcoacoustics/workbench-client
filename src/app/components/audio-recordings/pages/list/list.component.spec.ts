import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { AudioRecordingsListComponent } from "./list.component";

describe("AudioRecordingsListComponent", () => {
  let spectator: SpectatorRouting<AudioRecordingsListComponent>;

  const createComponent = createRoutingFactory({
    component: AudioRecordingsListComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  beforeEach(() => spectator = createComponent({ detectChanges: false }));

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioRecordingsListComponent);
  });
});
