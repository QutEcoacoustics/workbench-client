import { Configuration } from "@helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Configuration = {
  production: false,
  version,
} as any;

import "zone.js/dist/zone-error"; // Included with Angular CLI.
