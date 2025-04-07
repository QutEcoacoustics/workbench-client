import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { UniversalDeviceDetectorService } from "@services/universal-device-detector/universal-device-detector.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from "src/environments/environment";
import { NgHttpCachingConfig, NgHttpCachingModule, NgHttpCachingStrategy } from "ng-http-caching";
import { disableCache } from "@services/cache/ngHttpCachingConfig";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

// we disable caching on the server to prevent potentially serving stale data
// and data that requires authorization to unauthenticated users
export const serverCacheConfig = {
  isCacheable: disableCache,
  cacheStrategy: NgHttpCachingStrategy.DISALLOW_ALL,
} as const satisfies NgHttpCachingConfig;

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // Timeout API requests after set period
    BawTimeoutModule.forRoot({ timeout: environment.ssrTimeout }),
    // we explicitly provide NgHttpCachingModule with a disabled cache strategy
    // to prevent caching on the server
    NgHttpCachingModule.forRoot(serverCacheConfig),
  ],
  providers: [
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
