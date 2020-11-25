import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let spectator: Spectator<SendAudioComponent>;
  const createComponent = createComponentFactory({
    component: SendAudioComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<SendAudioComponent>(() => spectator, CMS.dataUpload);
});
