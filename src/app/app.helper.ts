import { isPlatformServer } from "@angular/common";
import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";

/**
 * Default number of milliseconds to wait when de-bouncing an input
 *
 * I chose a 200ms debounce delay because it means that worst case scenario,
 * we are sending 5 requests per second to the server, which _should_ not
 * overload the server.
 *
 * If the UI is buggy, and produces a lot of jank & layout shifts when changing
 * search conditions, lower debounce times can produce a worse user experience.
 * Lower debounce times increase the quality required of the front-end code.
 */
export const defaultDebounceTime = 200; // ms

/**
 * Default time to wait before showing a loading indicator.
 * This prevents flickering when loading is very fast.
 */
export const defaultSlowLoadTime = 400; // ms

/** Returns a boolean value of whether the application is running in SSR mode */
export const IS_SERVER_PLATFORM = new InjectionToken<boolean>("Is server?", {
  factory() {
    return isPlatformServer(inject(PLATFORM_ID));
  },
});

/**
 * @description
 * Injection token to determine if the current build target is web components.
 */
export const IS_WEB_COMPONENT_TARGET = new InjectionToken<boolean>(
  "is-web-components-target",
);
