import { provideHttpClientTesting } from "@angular/common/http/testing";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let spectator: Spectator<EthicsComponent>;

  const createComponent = createComponentFactory({
    component: EthicsComponent,
    providers: [
      provideMockBawApi(),
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<EthicsComponent>(() => spectator, CMS.ethics);
});
