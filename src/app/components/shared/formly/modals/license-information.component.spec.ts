import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { modelData } from "@test/helpers/faker";
import { SpdxLicense } from "@services/licenses/licenses.service";
import { LicenseInformationModalComponent } from "./license-information.component";

describe("LicenseInformationModalComponent", () => {
  let spec: Spectator<LicenseInformationModalComponent>;
  let mockLicense: SpdxLicense;

  const createComponent = createComponentFactory({
    component: LicenseInformationModalComponent,
    mocks: [NgbModalRef],
  });

  const licenseUrl = () => spec.query<HTMLAnchorElement>(".license-url");
  const licenseTitle = () => spec.query<HTMLHeadingElement>(".modal-title");
  const licenseContent = () => spec.query<HTMLPreElement>(".license-content");

  function setup(): void {
    spec = createComponent({ detectChanges: false });

    spec.setInput("license", mockLicense);

    spec.detectChanges();
  }

  function generateLicenseInformation(): SpdxLicense {
    return {
      name: modelData.licenseName(),
      url: modelData.internet.url(),
      osiApproved: modelData.datatype.boolean(),
      licenseText: modelData.lorem.paragraph(),
    };
  }

  beforeEach(() => {
    mockLicense = generateLicenseInformation();
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseInformationModalComponent);
  });

  it("should have a link to the license information", () => {
    expect(licenseUrl()).toHaveAttribute("href", mockLicense.url);
  });

  it("should show the license name in the modal header", () => {
    expect(licenseTitle()).toHaveExactTrimmedText(mockLicense.name);
  });

  it("should show the slotted license content", () => {
    expect(licenseContent()).toHaveExactTrimmedText(mockLicense.licenseText);
  });
});
