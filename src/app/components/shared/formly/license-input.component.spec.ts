import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { getElementByInnerText } from "@test/helpers/html";
import { modelData } from "@test/helpers/faker";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { LicensesService, SpdxLicense } from "@services/licenses/licenses.service";
import { fakeAsync, tick } from "@angular/core/testing";
import { formlyConfig } from "./custom-inputs.module";
import { LicenseInputComponent } from "./license-input.component";

describe("LicenseInputComponent", () => {
  let spec: SpectatorHost<LicenseInputComponent>;

  let model: string;
  let formGroup: FormGroup;
  let mockAvailableLicenses: Record<string, SpdxLicense>;

  let licenseService: SpyObject<LicensesService>;
  let modalsSpy: SpyObject<NgbModal>;

  const createHost = createHostFactory({
    component: LicenseInputComponent,
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
    key: string = "license",
    initialLicense?: string,
    options: FormlyFieldProps = {}
  ): void {
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
        name: modelData.lorem.sentence(),
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
  }

  afterEach(() => {
    modalsSpy.dismissAll();
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  });

  describe("adding licenses", () => {
    it("should show the existing license value", fakeAsync(() => {
      const initialLicense = modelData.license();
      setup("license", initialLicense);

      spec.detectChanges();
      tick();
      spec.detectChanges();

      expect(spec.component.formControl.value).toEqual(initialLicense);
      const licenseTarget = licenseInput();

      expect(licenseTarget).toHaveValue(initialLicense);
      expect(licenseTarget).toHaveExactTrimmedText(mockAvailableLicenses[initialLicense].name);
    }));

    it("should be able to add a new license", () => {});

    it("should be able to change an existing license", () => {});
  });

  describe("removing licenses", () => {
    it("should not show the remove button if there is no license selected", () => {});

    it("should be able to remove an existing license", () => {});

    it("should be able to remove a license that has not been committed", () => {});
  });

  describe("showing license information", () => {
    it("should not have a visible 'show' button if there is no selected license", () => {});

    it("should show the current license information if the 'show' button is clicked", () => {});
  });
});
