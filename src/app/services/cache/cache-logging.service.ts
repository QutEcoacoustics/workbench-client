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

/** Log a request that was cached */
export const withCacheLogging = (context = new HttpContext()) => context.set(CACHE_LOGGING, true);

@Injectable()
export class CacheLoggingService implements HttpInterceptor {
  public constructor(@Inject(CACHE_SETTINGS) private cacheSettings: CacheSettings) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.cacheSettings.showLogging && req.context.get(CACHE_LOGGING)) {
      // eslint-disable-next-line no-console
      console.debug("(CacheLoggingService) Caching requests for ", req.url);
    }

    return next.handle(req);
  }
}
