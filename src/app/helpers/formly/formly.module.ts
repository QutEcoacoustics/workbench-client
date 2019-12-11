import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyFieldFileComponent } from "./file-value.component";
import { FileValueAccessorDirective } from "./file-value.directive";

export function minLengthValidationMessage(err, field) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

export function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

const declarations = [FormlyFieldFileComponent, FileValueAccessorDirective];
export const formlyRoot = {
  validationMessages: [
    { name: "required", message: "This field is required" },
    { name: "minlength", message: minLengthValidationMessage },
    { name: "maxlength", message: maxLengthValidationMessage },
    { name: "min", message: minValidationMessage },
    { name: "max", message: maxValidationMessage }
  ],
  types: [
    {
      name: "file",
      component: FormlyFieldFileComponent,
      wrappers: ["form-field"]
    }
  ]
};

@NgModule({
  declarations: [declarations],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot(formlyRoot)
  ]
})
export class FormlyCustomModule {}
