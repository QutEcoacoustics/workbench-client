import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { InstanceSettingsComponent } from "./instance-settings.component";

describe("InstanceSettingsComponent", () => {
  let spec: Spectator<InstanceSettingsComponent>;

  const createComponent = createComponentFactory({
    component: InstanceSettingsComponent,
  });

  function setup(): void {
    spec = createComponent();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeTruthy();
  });
});
