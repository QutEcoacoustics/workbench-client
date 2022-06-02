import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ApiResponse } from "@baw-api/baw-api.service";
import { HttpCacheInterceptorModule } from "@ngneat/cashew";
import { CacheLoggingService } from "./cache-logging.service";
import { cacheSettings } from "./cache-settings";

@NgModule({
  imports: [
    // Cache API requests
    HttpCacheInterceptorModule.forRoot({
      strategy: "explicit",
      responseSerializer(body: ApiResponse<unknown>) {
        if (cacheSettings.showLogging) {
          // eslint-disable-next-line no-console
          console.debug(
            "(HttpCacheInterceptorModule) Returned cached response: ",
            body
          );
        }
        return body;
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheLoggingService,
      multi: true,
    },
  ],
})
export class CacheModule {}
