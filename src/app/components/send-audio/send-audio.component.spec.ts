import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let spectator: Spectator<SendAudioComponent>;

  const createComponent = createComponentFactory({
    component: SendAudioComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<SendAudioComponent>(() => spectator, CMS.dataUpload);

  assertPageInfo(SendAudioComponent, "Send Audio");
});
