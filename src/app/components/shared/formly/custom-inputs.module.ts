import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { ConfigOption, FormlyModule } from "@ngx-formly/core";
import { IconsModule } from "@shared/icons/icons.module";
import { MapModule } from "@shared/map/map.module";
import { CheckboxInputComponent } from "./checkbox-input.component";
import { FileValueAccessorDirective } from "./file-input.directive";
import { HorizontalWrapperComponent } from "./horizontal-wrapper.component";
import { ImageInputComponent } from "./image-input.component";
import { LocationInputComponent } from "./location-input.component";
import { PasswordConfirmationInputComponent } from "./password-confirmation-input.component";
import { TimezoneInputComponent } from "./timezone-input.component";

export const formlyConfig: ConfigOption = {
  types: [
    { name: "checkbox", component: CheckboxInputComponent },
    { name: "image", component: ImageInputComponent },
    { name: "timezone", component: TimezoneInputComponent },
    { name: "location", component: LocationInputComponent },
    {
      name: "passwordConfirmation",
      component: PasswordConfirmationInputComponent,
    },
  ],
  wrappers: [
    { name: "form-field-horizontal", component: HorizontalWrapperComponent },
  ],
  validationMessages: [
    { name: "required", message: "This field is required" },
    {
      name: "minLength",
      message: (_, field) =>
        `Input should have at least ${field.props.minLength} characters`,
    },
    {
      name: "maxLength",
      message: (_, field) =>
        `This value should be less than ${field.props.maxLength} characters`,
    },
    {
      name: "min",
      message: (_, field) =>
        `This value should be more than ${field.props.min}`,
    },
    {
      name: "max",
      message: (_, field) =>
        `This value should be less than ${field.props.max}`,
    },
  ],
};

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
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    MapModule,
    IconsModule,
  ],
  exports: components,
})
export class CustomInputsModule {}
