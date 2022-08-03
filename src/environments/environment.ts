export const environment = {
  /** Is the current environment running in production mode */
  production: false,
  /** Timeout for web requests in server side renderer */
  ssrTimeout: 1_000,
  /** Timeout for web requests in browser */
  browserTimeout: 10_000,
  /**
   * Current build version of this code. This is set by the docker container
   * and should not be modified without care
   */
  version: "<<VERSION_REPLACED_WHEN_BUILT>>",
};

import "zone.js/plugins/zone-error"; // Included with Angular CLI.
