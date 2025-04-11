import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AudioRecording } from "@models/AudioRecording";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { PageTitleStrategy } from "src/app/app.component";
import { AudioRecordingsDetailsComponent } from "./details.component";

describe("AudioRecordingsDetailsComponent", () => {
  let spectator: Spectator<AudioRecordingsDetailsComponent>;
  let defaultAudioRecording: AudioRecording;

  const createComponent = createRoutingFactory({
    component: AudioRecordingsDetailsComponent,
    providers: [PageTitleStrategy],
    imports: [MockBawApiModule, SharedModule],
  });

  assertPageInfo<AudioRecording>(AudioRecordingsDetailsComponent, "11", {
    audioRecording: {
      model: new AudioRecording(generateAudioRecording({ id: 11 }))
    },
  });

  function setup() {
    defaultAudioRecording = new AudioRecording(generateAudioRecording());
    spectator = createComponent({ detectChanges: false });
    spyOnProperty(spectator.component, "recording", "get").and.callFake(() => defaultAudioRecording);
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioRecordingsDetailsComponent);
  });
});
