import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { LicenseWidgetComponent } from "./license-widget.component";

describe("LicenseWidgetComponent", () => {
  let spec: Spectator<LicenseWidgetComponent>;

  const createComponent = createComponentFactory({
    component: LicenseWidgetComponent,
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseWidgetComponent);
  });
});
