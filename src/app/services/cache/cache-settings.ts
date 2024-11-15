import { InjectionToken } from "@angular/core";

export class CacheSettings {
  public constructor(_enabled: boolean, withLogging: boolean) {
    this._enabled = _enabled;
    this.withLogging = withLogging;
  }

  /** TTL for HTTP GET requests */
  public httpGetTtlMs = 1_000;
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
