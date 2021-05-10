import { Configuration } from "@helpers/app-initializer/app-initializer";

export const environment = ({
  production: false,
  version: "dev",
} as Partial<Configuration>) as Configuration;

import "zone.js/dist/zone-error"; // Included with Angular CLI.
