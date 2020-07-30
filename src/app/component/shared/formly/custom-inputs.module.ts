import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import {
  TypeOption,
  WrapperOption,
} from "@ngx-formly/core/lib/services/formly.config";
import { MapModule } from "@shared/map/map.module";
import { FormlyCheckboxInput } from "./checkbox-input.component";
import { FileValueAccessor } from "./file-input.directive";
import { FormlyHorizontalWrapper } from "./horizontal-wrapper.component";
import { FormlyImageInput } from "./image-input.component";
import { FormlyLocationInput } from "./location-input.component";
import { FormlyPasswordConfirmationInput } from "./password-confirmation-input.component";
import { FormlyTimezoneInput } from "./timezone-input.component";

export const formlyInputTypes: TypeOption[] = [
  { name: "checkbox", component: FormlyCheckboxInput },
  { name: "image", component: FormlyImageInput },
  { name: "timezone", component: FormlyTimezoneInput },
  { name: "location", component: FormlyLocationInput },
  { name: "passwordConfirmation", component: FormlyPasswordConfirmationInput },
];

export const formlyWrappers: WrapperOption[] = [
  { name: "form-field-horizontal", component: FormlyHorizontalWrapper },
];

const components = [
  FileValueAccessor,
  FormlyCheckboxInput,
  FormlyHorizontalWrapper,
  FormlyImageInput,
  FormlyLocationInput,
  FormlyPasswordConfirmationInput,
  FormlyTimezoneInput,
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
