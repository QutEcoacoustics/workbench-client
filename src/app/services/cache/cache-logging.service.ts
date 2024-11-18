import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CacheSettings, CACHE_SETTINGS } from "./cache-settings";

const CACHE_LOGGING = new HttpContextToken<boolean>(() => false);

/**
 * Log that a request was cached. This should be used in conjunction with the
 * `withCache()` context
 *
 * ```ts
 * return this.http.get("http://api/1", {
 *    context: withCache({context: withCacheLogging()}),
 * });
 * ```
 */
export const withCacheLogging = (context = new HttpContext()) =>
  context.set(CACHE_LOGGING, true);

@Injectable()
export class CacheLoggingService implements HttpInterceptor {
  public constructor(
    @Inject(CACHE_SETTINGS) private cacheSettings: CacheSettings
  ) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.cacheSettings.showLogging && req.context.get(CACHE_LOGGING)) {
      // eslint-disable-next-line no-console
      console.debug("(CacheLoggingService) Caching requests for ", req.url);
    }

    return next.handle(req);
  }
}
