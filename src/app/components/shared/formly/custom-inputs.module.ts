import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import {
  TypeOption,
  ValidationMessageOption,
  WrapperOption,
} from "@ngx-formly/core/lib/services/formly.config";
import { MapModule } from "@shared/map/map.module";
import { CheckboxInputComponent } from "./checkbox-input.component";
import { FileValueAccessorDirective } from "./file-input.directive";
import { HorizontalWrapperComponent } from "./horizontal-wrapper.component";
import { ImageInputComponent } from "./image-input.component";
import { LocationInputComponent } from "./location-input.component";
import { PasswordConfirmationInputComponent } from "./password-confirmation-input.component";
import { TimezoneInputComponent } from "./timezone-input.component";

export const formlyInputTypes: TypeOption[] = [
  {
    name: "checkbox",
    component: CheckboxInputComponent,
    wrappers: ["form-field-horizontal"],
  },
  { name: "image", component: ImageInputComponent },
  {
    name: "timezone",
    component: TimezoneInputComponent,
    defaultOptions: {
      /*
       * Sets default timezone selection to location of server. This is
       * a solution to bypass an exception thrown by ngx-formly:
       * https://github.com/ngx-formly/ngx-formly/issues/1410
       */
      defaultValue: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  },
  { name: "location", component: LocationInputComponent },
  {
    name: "passwordConfirmation",
    component: PasswordConfirmationInputComponent,
  },
];

export const formlyWrappers: WrapperOption[] = [
  { name: "form-field-horizontal", component: HorizontalWrapperComponent },
];

export const formlyValidationMessages: ValidationMessageOption[] = [
  { name: "required", message: "This field is required" },
  {
    name: "minlength",
    message: (_, field) =>
      `Input should have at least ${field.templateOptions.minLength} characters`,
  },
  {
    name: "maxlength",
    message: (_, field) =>
      `This value should be less than ${field.templateOptions.maxLength} characters`,
  },
  {
    name: "min",
    message: (_, field) =>
      `This value should be more than ${field.templateOptions.min}`,
  },
  {
    name: "max",
    message: (_, field) =>
      `This value should be less than ${field.templateOptions.max}`,
  },
];

const components = [
  FileValueAccessorDirective,
  CheckboxInputComponent,
  HorizontalWrapperComponent,
  ImageInputComponent,
  LocationInputComponent,
  PasswordConfirmationInputComponent,
  TimezoneInputComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    MapModule,
  ],
  exports: components,
})
export class CustomInputsModule {}
