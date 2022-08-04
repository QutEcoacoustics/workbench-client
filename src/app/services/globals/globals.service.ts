/* eslint-disable no-console */
import { Injectable } from "@angular/core";
import { cacheSettings } from "@services/cache/cache-settings";

@Injectable({ providedIn: "root" })
export class GlobalsService {
  private globals = {};
  // TODO namespace is a bad name
  private namespace = "__bawWorkbenchClient";

  public initialize(): void {
    console.log("Hello");
    window[this.namespace] = this.globals;
    console.debug(`
      (GlobalsService)

      ~~~~~~~~~~~~~~~~~~~~
      BAW Workbench Client
      ~~~~~~~~~~~~~~~~~~~~

      Some functionality of this website can be toggled from the developer console. A list of commands and their usages can be seen below:
      - ${this.toggleCaching()}
      - ${this.toggleCacheLogging()}
    `);

    this.toggleCacheLogging();
  }

  public toggleCaching(): string {
    const functionName = "toggleCache";
    this.globals[functionName] = (): void => {
      cacheSettings.setCaching(!cacheSettings.enabled);
      console.debug(
        "(GlobalsService) Cache is now " +
          (cacheSettings.enabled ? "enabled" : "disabled")
      );
    };
    return `${this.namespace}.${functionName}(): This will toggle on/off caching of API requests`;
  }

  public toggleCacheLogging(): string {
    const functionName = "toggleCacheLogging";
    this.globals[functionName] = (): void => {
      cacheSettings.setLogging(!cacheSettings.showLogging);
      console.debug(
        "(GlobalsService) Cache logging is now " +
          (cacheSettings.showLogging ? "enabled" : "disabled")
      );
    };

    return `${this.namespace}.${functionName}(): This will toggle on/off logging when API request caching occurs`;
  }
}
