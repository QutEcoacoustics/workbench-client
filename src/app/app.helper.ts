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
 * Default number of milliseconds to wait when de-bouncing an input
 */
export const defaultDebounceTime = 500;

/** Determines if the current instance is inside a server side rendering environment */
export function isSsr(): boolean {
  return typeof window === "undefined" && typeof document === "undefined";
}
