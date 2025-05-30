import { InjectionToken } from "@angular/core";

/**
 * Object data from an environment.json that can be used to construct a
 * Configuration model.
 * This DI token exists so that different environments (e.g. browser, ssr, and
 * test) can use their own methods to create an API_CONFIG.
 */
export const API_CONFIG = new InjectionToken<Promise<any>>("baw.api.config");
export const API_ROOT = new InjectionToken<string>("baw.api.root");
