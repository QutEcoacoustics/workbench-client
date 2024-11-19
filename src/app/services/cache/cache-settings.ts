import { InjectionToken } from "@angular/core";

export class CacheSettings {
  public constructor(
    enabled: boolean,
    withLogging: boolean,
  ) {
    this._enabled = enabled;
    this.withLogging = withLogging;
  }

  /** time to live for cached HTTP requests */
  public cacheLifetimeSeconds: number;
  private withLogging: boolean;
  private _enabled: boolean;

  /** Is cache logging enabled */
  public get showLogging(): boolean {
    return this._enabled && this.withLogging;
  }

  /** Is caching enabled */
  public get enabled(): boolean {
    return this._enabled;
  }

  /** Enable/Disable caching */
  public setCaching(enable: boolean): void {
    this._enabled = enable;
    this.logToConsole(`Cache is now ${this.enabled ? "enabled" : "disabled"}`);
  }

  /**
   * Enable/Disable logging. Logging cannot be enabled without caching being
   * enabled
   */
  public setLogging(enable: boolean): void {
    this.withLogging = enable;
    this.logToConsole(`Cache logging is now ${this.showLogging ? "enabled" : "disabled"}`);
  }

  private logToConsole(message: string): void {
    // eslint-disable-next-line no-console
    console.debug(`(Cache Settings) ${message}`);
  }
}

export const CACHE_SETTINGS = new InjectionToken<CacheSettings>(
  "baw.cache.settings",
);
export const cacheSettings = new CacheSettings(true, false);
