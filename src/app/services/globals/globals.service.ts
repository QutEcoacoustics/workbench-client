import { Inject, Injectable } from "@angular/core";
import { CACHE_SETTINGS, CacheSettings } from "@services/cache/cache-settings";

/**
 * Global functions accessible in the console dev tools
 */
@Injectable({ providedIn: "root" })
export class GlobalsService {
  private namespace = "__bawWorkbenchClient";

  public constructor(
    @Inject(CACHE_SETTINGS) private cacheSettings: CacheSettings
  ) {}

  public initialize(): void {
    window[this.namespace] = this;
    this.logToConsole(`
      ~~~~~~~~~~~~~~~~~~~~
      BAW Workbench Client
      ~~~~~~~~~~~~~~~~~~~~

      Some functionality of this website can be toggled from the dev tools. A list of commands and their usages can be seen below:
      - ${this.namespace}.${this.cacheEnabledDescription}
      - ${this.namespace}.${this.cacheLoggingEnabledDescription}
    `);
  }

  public get cacheEnabled(): boolean {
    return this.cacheSettings.enabled;
  }

  public set cacheEnabled(enabled: boolean) {
    this.cacheSettings.setCaching(enabled);
    this.logToConsole(
      "Cache is now " + (this.cacheSettings.enabled ? "enabled" : "disabled")
    );
  }

  private get cacheEnabledDescription(): string {
    const funcName: keyof GlobalsService = "cacheEnabled";
    return `${funcName}: This will turn on/off caching of API requests`;
  }

  public get cacheLoggingEnabled(): boolean {
    return this.cacheSettings.showLogging;
  }

  public set cacheLoggingEnabled(enabled: boolean) {
    this.cacheSettings.setLogging(enabled);
    this.logToConsole(
      "Cache logging is now " +
        (this.cacheSettings.showLogging ? "enabled" : "disabled")
    );
  }

  private get cacheLoggingEnabledDescription(): string {
    const funcName: keyof GlobalsService = "cacheLoggingEnabled";
    return `${funcName}: This will turn on/off logging when API request caching occurs`;
  }

  // TODO This should just go through a console wrapper
  private logToConsole(text: string): void {
    // eslint-disable-next-line no-console
    console.debug("(GlobalsService) " + text);
  }
}
