import { createHostFactory, Spectator } from "@ngneat/spectator";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { modelData } from "@test/helpers/faker";
import { input } from "@angular/core";
import {
  LicenseInformation,
  LicenseInformationModalComponent,
} from "./license-information.component";

describe("LicenseInformationModalComponent", () => {
  let spec: Spectator<LicenseInformationModalComponent>;

  let mockLicense: LicenseInformation;
  let testSlotContent: string;

  const createComponent = createHostFactory({
    component: LicenseInformationModalComponent,
    mocks: [NgbModalRef],
  });

  const licenseUrl = () => spec.query<HTMLAnchorElement>(".license-url");
  const licenseTitle = () => spec.query<HTMLHeadingElement>(".modal-title");
  const licenseContent = () => spec.query<HTMLPreElement>(".license-content");

  function setup(): void {
    spec = createComponent(
    `
      <baw-license-information-modal>
        ${testSlotContent}
      </baw-license-information-modal>
    `,
    {
      detectChanges: false,
      props: {
        license: (input as any)(mockLicense),
      },
    },
    );

    // we use the TestBed fixture because ngNeat spectator does not support
    // signal based inputs
    spec.fixture.componentRef.setInput("license", mockLicense);

    spec.detectChanges();
  }

  function generateLicenseInformation(): LicenseInformation {
    return {
      name: modelData.lorem.sentence(),
      url: modelData.internet.url(),
    };
  }

  beforeEach(() => {
    mockLicense = generateLicenseInformation();
    testSlotContent = modelData.lorem.paragraph();

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
    expect(licenseContent()).toHaveExactTrimmedText(testSlotContent);
  });
});
