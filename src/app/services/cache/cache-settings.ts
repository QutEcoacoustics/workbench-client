import { InjectionToken } from "@angular/core";

export class CacheSettings {
  /** TTL for HTTP GET requests */
  public httpGetTtlMs = 1000;

  public constructor(private _enabled: boolean, private withLogging: boolean) {}

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
  }

  /**
   * Enable/Disable logging. Logging cannot be enabled without caching being
   * enabled
   */
  public setLogging(enable: boolean): void {
    this.withLogging = enable;
  }
}

export const CACHE_SETTINGS = new InjectionToken<CacheSettings>(
  "baw.cache.settings"
);
export const cacheSettings = new CacheSettings(true, false);
