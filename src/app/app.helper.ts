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
 * Default number of milliseconds to wait when de-bouncing an input
 */
export const defaultDebounceTime = 500;

/**
 * Create a download file prompt
 *
 * @param blob Blob to download
 * @param filename Name of file including file extension
 */
export function downloadBlob(blob: Blob, filename: string) {
  /*
   * This is a fairly terrible method of doing this, however I can't
   * seem to find an angular approved method that allows me to intercept
   * the request and append headers. This turns the response into a blob,
   * creates a hidden link to download the file, and then clicks on it.
   * This solution may be potentially blocked by browsers in the future.
   * Unfortunately, this is fairly difficult to test so evaluate this on ALL
   * browsers if you intend to change anything.
   */
  const anchorEl = window.document.createElement("a");
  anchorEl.href = window.URL.createObjectURL(blob);
  anchorEl.download = filename;
  anchorEl.hidden = true;
  document.body.appendChild(anchorEl);
  // Blocked by IE
  anchorEl.click();
  document.body.removeChild(anchorEl);
}
