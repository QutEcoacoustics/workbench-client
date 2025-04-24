import { BawSessionService } from "@baw-api/baw-session.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { provideMockConfig } from "@services/config/provide-ConfigMock";
import { IconsModule } from "@shared/icons/icons.module";
import { WIPComponent } from "./wip.component";

describe("WIPComponent", () => {
  let spec: Spectator<WIPComponent>;

  const createComponent = createComponentFactory({
    component: WIPComponent,
    imports: [IconsModule],
    providers: [BawSessionService, provideMockConfig()],
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeTruthy();
  });
});
