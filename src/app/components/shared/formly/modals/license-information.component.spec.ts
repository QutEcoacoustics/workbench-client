import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LicenseInformationModalComponent } from "./license-information.component";

describe("LicenseInformationModalComponent", () => {
  let spec: Spectator<LicenseInformationModalComponent>;

  const createComponent = createComponentFactory({
    component: LicenseInformationModalComponent,
    mocks: [NgbModalRef],
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseInformationModalComponent);
  });
});
