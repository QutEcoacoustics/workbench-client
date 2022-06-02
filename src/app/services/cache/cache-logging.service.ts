import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { cacheSettings } from "./cache-settings";

const CACHE_LOGGING = new HttpContextToken<boolean>(() => false);

/**
 * Log that a request was cached. This should be used in conjunction with the
 * `withCache()` context
 *
 * ```typescript
 * return this.http.get("http://api/1", {
      context: withCache({context: withCacheLogging()}),
   });
 * ```
 */
export const withCacheLogging = () =>
  new HttpContext().set(CACHE_LOGGING, true);

@Injectable()
export class CacheLoggingService implements HttpInterceptor {
  public constructor() {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (cacheSettings.showLogging && req.context.get(CACHE_LOGGING)) {
      // eslint-disable-next-line no-console
      console.debug("(CacheLoggingService) Caching requests for ", req.url);
    }

    return next.handle(req);
  }
}
