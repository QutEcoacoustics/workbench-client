import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { DisclaimersComponent } from "./disclaimers.component";

describe("AboutDisclaimersComponent", () => {
  let spectator: Spectator<DisclaimersComponent>;
  const createComponent = createComponentFactory({
    component: DisclaimersComponent,
    imports: [SharedModule, MockAppConfigModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<DisclaimersComponent>(() => {
    spectator.detectChanges();
    return { spectator };
  }, CMS.PRIVACY);
});
