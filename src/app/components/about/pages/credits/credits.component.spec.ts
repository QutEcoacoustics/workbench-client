import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { CreditsComponent } from "./credits.component";

describe("AboutCreditsComponent", () => {
  let spectator: Spectator<CreditsComponent>;
  const createComponent = createComponentFactory({
    component: CreditsComponent,
    imports: [SharedModule, MockAppConfigModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<CreditsComponent>(() => {
    spectator.detectChanges();
    return { spectator };
  }, CMS.CREDITS);
});
