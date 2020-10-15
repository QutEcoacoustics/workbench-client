import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let spectator: Spectator<EthicsComponent>;
  const createComponent = createComponentFactory({
    component: EthicsComponent,
    imports: [SharedModule, MockAppConfigModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<EthicsComponent>(() => {
    spectator.detectChanges();
    return { spectator };
  }, CMS.ETHICS);
});
