import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let spectator: Spectator<EthicsComponent>;
  const createComponent = createComponentFactory({
    component: EthicsComponent,
    imports: [MockBawApiModule],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<EthicsComponent>(() => spectator, CMS.ethics);
});
