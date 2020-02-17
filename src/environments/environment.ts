import { version } from "../../package.json";

export const environment = {
  production: false,
  version,

  // This will be updated by the appConfig service
  googleMapsKey: ""
};

import "zone.js/dist/zone-error"; // Included with Angular CLI.
