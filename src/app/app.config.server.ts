import { mergeApplicationConfig, ApplicationConfig } from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";
import {
  NgHttpCachingConfig,
  NgHttpCachingStrategy,
  provideNgHttpCaching,
} from "ng-http-caching";
import { disableCache } from "@services/cache/ngHttpCachingConfig";
import { DeviceDetectorService } from "ngx-device-detector";
import { UniversalDeviceDetectorService } from "@services/universal-device-detector/universal-device-detector.service";
import { providerTimeoutInterceptor } from "@services/timeout/provide-timeout";
import { environment } from "src/environments/environment";
import { appConfig } from "./app.config";

// we disable caching on the server to prevent potentially serving stale data
// and data that requires authorization to unauthenticated users
export const serverCacheConfig = {
  isCacheable: disableCache,
  cacheStrategy: NgHttpCachingStrategy.DISALLOW_ALL,
} as const satisfies NgHttpCachingConfig;

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),

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
};

export const ssrConfig = mergeApplicationConfig(appConfig, serverConfig);
