import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { serviceProviders } from "@baw-api/ServiceProviders";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ConfigOption, FormlyFieldConfig } from "@ngx-formly/core";
import { FormlyCheckboxInput } from "./component/shared/formly/checkbox-input.component";
import { FormlyHorizontalWrapper } from "./component/shared/formly/horizontal-wrapper";
import { FormlyImageInput } from "./component/shared/formly/image-input.component";
import { FormlyTimezoneInput } from "./component/shared/formly/timezone-input.component";
import { FormTouchedGuard } from "./guards/form/form.guard";
import {
  API_CONFIG,
  API_ROOT,
  AppInitializer,
  ASSET_ROOT,
  CMS_ROOT,
} from "./helpers/app-initializer/app-initializer";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";

/**
 * Input min length validation message
 * @param err Error message
 * @param field Formly field
 */
export function minLengthValidationMessage(_, field: FormlyFieldConfig) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

/**
 * Input max length validation message
 * @param err Error message
 * @param field Formly field
 */
export function maxLengthValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

/**
 * Number input min value validation message
 * @param err Error message
 * @param field Formly field
 */
export function minValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be more than ${field.templateOptions.min}`;
}

/**
 * Number input max value validation message
 * @param err Error message
 * @param field Formly field
 */
export function maxValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be less than ${field.templateOptions.max}`;
}

/**
 * Toastr Service global defaults
 */
export const toastrRoot = {
  closeButton: true,
  enableHtml: true,
  positionClass: "toast-top-center",
};

/**
 * Formly types and validation messages
 */
export const formlyRoot = {
  types: [
    {
      name: "checkbox",
      component: FormlyCheckboxInput,
    },
    {
      name: "image",
      component: FormlyImageInput,
    },
    {
      name: "timezone",
      component: FormlyTimezoneInput,
    },
  ],
  wrappers: [
    { name: "form-field-horizontal", component: FormlyHorizontalWrapper },
  ],
  validationMessages: [
    { name: "required", message: "This field is required" },
    { name: "minlength", message: minLengthValidationMessage },
    { name: "maxlength", message: maxLengthValidationMessage },
    { name: "min", message: minValidationMessage },
    { name: "max", message: maxValidationMessage },
  ],
} as ConfigOption;

/**
 * Load icon packs into font awesome library
 * @param library Font awesome library
 */
export function fontAwesomeLibraries(library: FaIconLibrary) {
  library.addIconPacks(fas);
}

/**
 * App providers
 */
export const providers = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: AppInitializer.initializerFactory,
    multi: true,
    deps: [API_CONFIG],
  },
  {
    provide: API_ROOT,
    useFactory: AppInitializer.apiRootFactory,
  },
  {
    provide: CMS_ROOT,
    useFactory: AppInitializer.cmsRootFactory,
  },
  {
    provide: ASSET_ROOT,
    useFactory: AppInitializer.assetRootFactory,
  },
  FormTouchedGuard,
  ...serviceProviders,
];
