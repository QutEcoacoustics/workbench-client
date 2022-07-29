import { InjectionToken } from "@angular/core";

export const API_CONFIG = new InjectionToken<Promise<any>>("baw.api.config");

export const API_ROOT = new InjectionToken<string>("baw.api.root");
