import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { getElementByInnerText } from "@test/helpers/html";
import { formlyConfig } from "./custom-inputs.module";
import { LicenseInputComponent } from "./license-input.component";

describe("LicenseInputComponent", () => {
  let spec: SpectatorHost<LicenseInputComponent>;

  let model: string;
  let formGroup: FormGroup;

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
    key: string = "file",
    initialLicense?: string,
    options: FormlyFieldProps = {},
  ): void {
    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = "";

    const formControl = formGroup.get("asFormControl");
    if (initialLicense) {
      formControl.setValue(initialLicense);
    }

    spec = createHost(
      `
      <form [formGroup]="formGroup">
        <baw-license-input></baw-license-input>
      </form>
    `,
      {
        hostProps: { formGroup },
        props: {
          field: {
            props: options,
            model,
            key,
            formControl,
          },
        },
      }
    );

    spec.detectChanges();
  }

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  });

  describe("adding licenses", () => {
    it("should show the existing license value", () => {
      const initialLicense = "MIT";
      setup("license", initialLicense);

      expect(spec.component.formControl.value).toEqual(initialLicense);
      expect(licenseInput()).toHaveValue(initialLicense);
    });

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
