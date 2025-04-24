import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let spectator: Spectator<SendAudioComponent>;

  const createComponent = createComponentFactory({
    component: SendAudioComponent,
    providers: [
      provideMockBawApi(),
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<SendAudioComponent>(() => spectator, CMS.dataUpload);

  assertPageInfo(SendAudioComponent, "Send Audio");
});
