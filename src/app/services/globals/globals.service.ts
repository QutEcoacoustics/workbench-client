import { Injectable } from "@angular/core";
import { cacheSettings } from "@services/cache/cache-settings";

/**
 * Global functions accessible in the console dev tools
 */
@Injectable({ providedIn: "root" })
export class GlobalsService {
  private globals = {};
  // TODO namespace is a bad name
  private namespace = "__bawWorkbenchClient";

  public initialize(): void {
    window[this.namespace] = this.globals;
    this.logToConsole(`
      ~~~~~~~~~~~~~~~~~~~~
      BAW Workbench Client
      ~~~~~~~~~~~~~~~~~~~~

      Some functionality of this website can be toggled from the dev tools. A list of commands and their usages can be seen below:
      - ${this.toggleCaching()}
      - ${this.toggleCacheLogging()}
    `);

    this.toggleCacheLogging();
  }

  public toggleCaching(): string {
    const functionName = "toggleCache";
    this.globals[functionName] = (): void => {
      cacheSettings.setCaching(!cacheSettings.enabled);
      this.logToConsole(
        "Cache is now " + (cacheSettings.enabled ? "enabled" : "disabled")
      );
    };
    return `${this.namespace}.${functionName}(): This will toggle on/off caching of API requests`;
  }

  public toggleCacheLogging(): string {
    const functionName = "toggleCacheLogging";
    this.globals[functionName] = (): void => {
      cacheSettings.setLogging(!cacheSettings.showLogging);
      this.logToConsole(
        "(GlobalsService) Cache logging is now " +
          (cacheSettings.showLogging ? "enabled" : "disabled")
      );
    };

    return `${this.namespace}.${functionName}(): This will toggle on/off logging when API request caching occurs`;
  }

  // TODO This should just go through a console wrapper
  private logToConsole(text: string): void {
    // eslint-disable-next-line no-console
    console.debug("(GlobalsService) " + text);
  }
}
