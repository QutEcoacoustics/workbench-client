import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { clickButton, getElementByInnerText } from "@test/helpers/html";
import { modelData } from "@test/helpers/faker";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  LicensesService,
  SpdxLicense,
} from "@services/licenses/licenses.service";
import { fakeAsync, tick } from "@angular/core/testing";
import { formlyConfig } from "./custom-inputs.module";
import { LicenseInputComponent } from "./license-input.component";
import { LicenseInformationModalComponent } from "./modals/license-information.component";

describe("LicenseInputComponent", () => {
  let spec: SpectatorHost<LicenseInputComponent>;

  let model: string;
  let formGroup: FormGroup;
  let mockAvailableLicenses: Record<string, SpdxLicense>;

  let licenseService: SpyObject<LicensesService>;
  let modalsSpy: SpyObject<NgbModal>;

  const createHost = createHostFactory({
    component: LicenseInputComponent,
    declarations: [LicenseInformationModalComponent],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
    ],
  });

  const licenseInput = () =>
    spec.query<HTMLSelectElement>("select.form-select");
  const removeButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "Remove");
  const showButton = () =>
    getElementByInnerText<HTMLButtonElement>(spec, "Show");

  function setup(
    initialLicense?: string,
    options: FormlyFieldProps = {}
  ): void {
    const key = "license";

    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = "";

    const hostTemplate = `
      <form [formGroup]="formGroup">
        <baw-license-input></baw-license-input>
      </form>
    `;

    const formControl = formGroup.get("asFormControl");
    spec = createHost(hostTemplate, {
      detectChanges: false,
      hostProps: { formGroup },
      props: {
        field: {
          props: options,
          model,
          key,
          formControl,
        },
      },
    });

    modalsSpy = spec.inject(NgbModal);
    const modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    spyOn(modalsSpy, "open").and.callThrough();

    mockAvailableLicenses = {
      [initialLicense ?? "mit-license"]: {
        name: initialLicense ?? "MIT License",
        url: modelData.internet.url(),
        osiApproved: modelData.datatype.boolean(),
        licenseText: modelData.lorem.paragraph(),
      },
      "mock-license": {
        name: "Mock License",
        url: modelData.internet.url(),
        osiApproved: modelData.datatype.boolean(),
        licenseText: modelData.lorem.paragraph(),
      },
    };

    licenseService = spec.inject(LicensesService);
    spyOn(licenseService, "availableLicenses").and.returnValue(
      mockAvailableLicenses
    );

    if (initialLicense) {
      formControl.setValue(initialLicense);
    }

    spec.detectChanges();
    tick();
    spec.detectChanges();
  }

  afterEach(() => {
    modalsSpy?.dismissAll();
  });

  it("should create", fakeAsync(() => {
    setup();
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  }));

  describe("adding licenses", () => {
    it("should show the existing license value", fakeAsync(() => {
      const initialLicense = modelData.license();
      setup(initialLicense);

      expect(spec.component.formControl.value).toEqual(initialLicense);
      const licenseTarget = licenseInput();

      expect(licenseTarget).toHaveValue(initialLicense);
    }));

    it("should be able to add a new license", fakeAsync(() => {
      setup();

      const initialLicenseTarget = licenseInput();
      expect(initialLicenseTarget).toHaveValue(null);

      const licenseKey = "mit-license";
      spec.selectOption(licenseInput(), licenseKey);
      spec.detectChanges();

      const licenseTarget = licenseInput();
      expect(licenseTarget).toHaveValue(licenseKey);
    }));

    it("should be able to change an existing license", fakeAsync(() => {
      setup();

      const firstLicense = licenseInput().value;

      spec.selectOption(licenseInput(), "mock-license");
      spec.detectChanges();

      const finalLicense = licenseInput().value;

      expect(firstLicense).not.toEqual(finalLicense);
    }));
  });

  describe("removing licenses", () => {
    it("should not show the remove button if there is no license selected", fakeAsync(() => {
      setup();
      expect(removeButton()).not.toExist();
    }));

    it("should be able to remove an existing license", fakeAsync(() => {
      setup(modelData.license());
      clickButton(spec, removeButton());
      expect(licenseInput()).toHaveValue(null);
    }));

    it("should be able to remove a license that was added after creation", fakeAsync(() => {
      setup();

      // add a license through the input after creation
      spec.selectOption(licenseInput(), "mock-license");
      spec.detectChanges();

      // Assert that the license was successfully added so that this test
      // doesn't pass when it should have failed because the license was never
      // added.
      expect(licenseInput()).toHaveValue("mock-license");

      // once the remove button is clicked, the license should be removed and
      // we should not see the remove button anymore
      clickButton(spec, removeButton());
      expect(licenseInput()).toHaveValue(null);
      expect(removeButton()).not.toExist();
    }));
  });

  describe("showing license information", () => {
    it("should not have a visible 'show' button if there is no selected license", fakeAsync(() => {
      setup();
      expect(showButton()).not.toExist();
    }));

    it("should show the current license information if the 'show' button is clicked", fakeAsync(() => {
      setup(modelData.license());
      clickButton(spec, showButton());
      expect(modalsSpy.open).toHaveBeenCalledTimes(1);
    }));

    it("should add the 'show' button if a license is added after creation", fakeAsync(() => {
      setup();

      spec.selectOption(licenseInput(), "mock-license");

      clickButton(spec, showButton());
      expect(modalsSpy.open).toHaveBeenCalledTimes(1);
    }));
  });
});
