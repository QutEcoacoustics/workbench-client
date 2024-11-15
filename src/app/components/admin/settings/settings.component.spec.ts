import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AdminSettingsComponent } from "./settings.component";

describe("AdminSettingsComponent", () => {
  let spectator: Spectator<AdminSettingsComponent>;

  const createComponent = createComponentFactory({
    component: AdminSettingsComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  assertPageInfo(AdminSettingsComponent, "Client Settings");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AdminSettingsComponent);
  });
});
