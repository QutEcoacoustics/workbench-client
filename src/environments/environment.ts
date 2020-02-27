import { Environment } from "src/app/helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Environment = {
  production: false,
  version
} as any;

import "zone.js/dist/zone-error"; // Included with Angular CLI.
