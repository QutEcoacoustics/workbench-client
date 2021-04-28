import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule, FormlyTemplateOptions } from "@ngx-formly/core";
import { CheckboxInputComponent } from "./checkbox-input.component";
import { formlyConfig } from "./custom-inputs.module";

describe("FormlyCheckboxInput", () => {
  let model: any;
  let formGroup: FormGroup;
  let spectator: SpectatorHost<CheckboxInputComponent>;
  const createHost = createHostFactory({
    component: CheckboxInputComponent,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
    ],
  });

  function getCheckbox() {
    return spectator.query<HTMLInputElement>("input[type='checkbox']");
  }

  function setup(
    key: string = "checkbox",
    options: FormlyTemplateOptions = {}
  ) {
    formGroup = new FormGroup({ checkbox: new FormControl("") });
    model = {};

    spectator = createHost(
      `
      <form [formGroup]="formGroup">
        <baw-checkbox-input></baw-checkbox-input>
      </form>
      `,
      {
        hostProps: { formGroup },
        props: {
          field: {
            model,
            key,
            formControl: formGroup.get("checkbox"),
            templateOptions: options,
          },
        },
      }
    );
    spectator.detectChanges();
  }

  it("should display checkbox", () => {
    setup();
    expect(getCheckbox()).toBeTruthy();
  });

  it("should activate checkbox on click", () => {
    setup();
    const checkbox = getCheckbox();
    checkbox.click();
    expect(checkbox.checked).toBeTruthy();
  });

  it("should deactivate checkbox on click", () => {
    setup();
    const checkbox = getCheckbox();
    checkbox.click();
    checkbox.click();
    expect(checkbox.checked).toBeFalsy();
  });

  // TODO Implement
});
