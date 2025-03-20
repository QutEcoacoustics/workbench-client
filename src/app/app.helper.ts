import { isPlatformServer } from "@angular/common";
import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";

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
