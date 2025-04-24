import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { CreditsComponent } from "./credits.component";

describe("AboutCreditsComponent", () => {
  let spectator: Spectator<CreditsComponent>;

  const createComponent = createComponentFactory({
    component: CreditsComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<CreditsComponent>(() => spectator, CMS.credits);
});
