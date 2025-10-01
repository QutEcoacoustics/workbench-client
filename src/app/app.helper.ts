import { isPlatformServer } from "@angular/common";
import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";

/**
 * Default number of milliseconds to wait when de-bouncing an input
 *
 * I chose a 200ms debounce delay because it means that worst case scenario,
 * we are sending 5 requests per second to the server.
 */
export const defaultDebounceTime = 200;

/** Returns a boolean value of whether the application is running in SSR mode */
export const IS_SERVER_PLATFORM = new InjectionToken<boolean>("Is server?", {
  factory() {
    return isPlatformServer(inject(PLATFORM_ID));
  },
});
