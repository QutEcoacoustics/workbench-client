import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormlyFieldProps, FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
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

  function setup(key: string = "file", options: FormlyFieldProps = {}): void {
    formGroup = new FormGroup({ asFormControl: new FormControl("") });
    model = "";

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
            model,
            key,
            formControl: formGroup.get("asFormControl"),
            props: options,
          },
        },
      }
    );
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  });
});
