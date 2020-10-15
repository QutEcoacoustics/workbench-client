import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let spectator: Spectator<SendAudioComponent>;
  const createComponent = createComponentFactory({
    component: SendAudioComponent,
    imports: [SharedModule, MockAppConfigModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<SendAudioComponent>(() => {
    spectator.detectChanges();
    return { spectator };
  }, CMS.DATA_UPLOAD);
});
