import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EnvironmentProviders, Provider } from "@angular/core";
import { provideNgHttpCaching } from "ng-http-caching";
import { CacheLoggingService } from "./cache-logging.service";
import { cacheSettings, CACHE_SETTINGS } from "./cache-settings";
import { defaultCachingConfig } from "./ngHttpCachingConfig";

export function provideCaching(): (EnvironmentProviders | Provider)[] {
  return [
    provideNgHttpCaching(defaultCachingConfig),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheLoggingService,
      multi: true,
    },
    { provide: CACHE_SETTINGS, useValue: cacheSettings },
  ];
}
