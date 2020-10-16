import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { CreditsComponent } from "./credits.component";

describe("AboutCreditsComponent", () => {
  let spectator: Spectator<CreditsComponent>;
  const createComponent = createComponentFactory({
    component: CreditsComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<CreditsComponent>(() => spectator, CMS.CREDITS);
});
