import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ConfigOption } from "@ngx-formly/core";
import {
  formlyInputTypes,
  formlyValidationMessages,
  formlyWrappers,
} from "@shared/formly/custom-inputs.module";
import { GlobalConfig } from "ngx-toastr";

/**
 * Toastr Service global defaults
 */
export const toastrRoot: Partial<GlobalConfig> = {
  closeButton: true,
  enableHtml: true,
  positionClass: "toast-top-center",
};

/**
 * Formly types and validation messages
 */
export const formlyRoot: ConfigOption = {
  extras: { lazyRender: true },
  types: formlyInputTypes,
  wrappers: formlyWrappers,
  validationMessages: formlyValidationMessages,
};

/**
 * Load icon packs into font awesome library
 * @param library Font awesome library
 */
export function fontAwesomeLibraries(library: FaIconLibrary) {
  library.addIconPacks(fas);
}

/**
 * Default number of milliseconds to wait when de-bouncing an input
 */
export const defaultDebounceTime = 500;
