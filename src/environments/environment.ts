import { Configuration } from "src/app/helpers/app-initializer/app-initializer";
import { version } from "../../package.json";

export const environment: Partial<Configuration> = {
  production: false,
  version
};

import "zone.js/dist/zone-error"; // Included with Angular CLI.
