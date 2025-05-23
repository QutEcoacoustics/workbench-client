import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { AudioRecordingsListComponent } from "./list.component";

describe("AudioRecordingsListComponent", () => {
  let spectator: Spectator<AudioRecordingsListComponent>;

  const createComponent = createRoutingFactory({
    component: AudioRecordingsListComponent,
    imports: [WebsiteStatusWarningComponent],
    providers: [provideMockBawApi()],
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
