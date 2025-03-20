import { isPlatformServer } from "@angular/common";
import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";
import { ToastOptions } from "@services/toasts/toasts.service";

/**
 * Toastr Service global defaults
 */
export const toastrRoot: Partial<ToastOptions> = {
  closeButton: true,
  enableHtml: true,
  positionClass: "toast-top-center",
  preventDuplicates: true,
  includeTitleDuplicates: false,
  resetTimeoutOnDuplicate: true,
};

/**
 * Default number of milliseconds to wait when de-bouncing an input
 */
export const defaultDebounceTime = 500;

/** Returns a boolean value of whether the application is running in SSR mode */
export const IS_SERVER_PLATFORM = new InjectionToken<boolean>("Is server?", {
  factory() {
    return isPlatformServer(inject(PLATFORM_ID));
  },
});
