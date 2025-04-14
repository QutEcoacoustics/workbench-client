import { BawSessionService } from "@baw-api/baw-session.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockConfigModule } from "@services/config/configMock.module";
import { WIPComponent } from "./wip.component";

describe("WIPComponent", () => {
  let spec: Spectator<WIPComponent>;
  const createComponent = createComponentFactory({
    component: WIPComponent,
    providers: [BawSessionService],
    imports: [MockConfigModule],
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeTruthy();
  });
});
