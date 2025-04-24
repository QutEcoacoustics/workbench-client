import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { providerTimeoutInterceptor } from "@services/timeout/provide-timeout";
import { UniversalDeviceDetectorService } from "@services/universal-device-detector/universal-device-detector.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from "src/environments/environment";
import {
  NgHttpCachingConfig,
  NgHttpCachingStrategy,
  provideNgHttpCaching,
} from "ng-http-caching";
import { disableCache } from "@services/cache/ngHttpCachingConfig";
import { AppComponent } from "./app.component";

// we disable caching on the server to prevent potentially serving stale data
// and data that requires authorization to unauthenticated users
export const serverCacheConfig = {
  isCacheable: disableCache,
  cacheStrategy: NgHttpCachingStrategy.DISALLOW_ALL,
} as const satisfies NgHttpCachingConfig;

@NgModule({
  imports: [ServerModule],
  providers: [
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService,
    },
    // we provide a different timeout interceptor for the server so that
    // requests can timeout faster than on the browser so that the user sees
    // their first content faster
    providerTimeoutInterceptor({ timeout: environment.ssrTimeout }),
    // we explicitly provide NgHttpCachingModule with a disabled cache strategy
    // to prevent caching on the server
    provideNgHttpCaching(serverCacheConfig),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
