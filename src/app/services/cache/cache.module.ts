import { HTTP_INTERCEPTORS, HttpRequest } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgHttpCachingConfig, NgHttpCachingModule } from "ng-http-caching";
import { CacheLoggingService, withCacheLogging } from "./cache-logging.service";
import { cacheSettings, CACHE_SETTINGS } from "./cache-settings";

// this is here just for testing and is not its final location
export const defaultCachingConfig = {
  isCacheable: (req: HttpRequest<any>) => {
    const shouldCacheMethod = req.method === "GET" || req.method === "HEAD"
    const isFilterRequest = req.method === "POST" && req.url.endsWith("/filter");

    if (shouldCacheMethod || isFilterRequest) {
      withCacheLogging(req);
      return true;
    } else {
      return false;
    }
  },
  getKey: (req: HttpRequest<any>) => {
    const base = req.method + "@" + req.urlWithParams;
    const requestBody = req.body;
    if (!requestBody || typeof requestBody !== "object") {
      return base;
    }

    // base64 encode the body
    const body = JSON.stringify(req.body);
    return base + ":" + btoa(body);
  },
} as const satisfies NgHttpCachingConfig;

@NgModule({
  imports: [NgHttpCachingModule.forRoot(defaultCachingConfig)],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheLoggingService,
      multi: true,
    },
    { provide: CACHE_SETTINGS, useValue: cacheSettings },
  ],
})
export class CacheModule {}
