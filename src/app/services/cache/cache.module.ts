import { HTTP_INTERCEPTORS, HttpRequest } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgHttpCachingConfig, NgHttpCachingModule } from "ng-http-caching";
import { CacheLoggingService } from "./cache-logging.service";
import { cacheSettings, CACHE_SETTINGS } from "./cache-settings";

// this is here just for testing and is not its final location
export const defaultCachingConfig: NgHttpCachingConfig = {
  isCacheable: (request: HttpRequest<any>) => {
    if (request.method === "GET" || request.method === "HEAD") {
      return true;
    }

    return request.method === "POST" && request.url.endsWith("/filter");
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
};

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
