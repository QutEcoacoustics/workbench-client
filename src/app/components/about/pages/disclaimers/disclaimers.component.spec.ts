import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { DisclaimersComponent } from "./disclaimers.component";

describe("AboutDisclaimersComponent", () => {
  let spectator: Spectator<DisclaimersComponent>;

  const createComponent = createComponentFactory({
    component: DisclaimersComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<DisclaimersComponent>(() => spectator, CMS.privacy);
});
