import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { provideNgHttpCaching } from "ng-http-caching";
import { CacheLoggingService } from "./cache-logging.service";
import { cacheSettings, CACHE_SETTINGS } from "./cache-settings";
import { defaultCachingConfig } from "./ngHttpCachingConfig";

@NgModule({
  providers: [
    provideNgHttpCaching(defaultCachingConfig),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheLoggingService,
      multi: true,
    },
    { provide: CACHE_SETTINGS, useValue: cacheSettings },
  ],
})
export class CacheModule {}
