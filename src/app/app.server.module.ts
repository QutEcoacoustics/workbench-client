import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { UniversalDeviceDetectorService } from "@services/universal-device-detector/universal-device-detector.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from "src/environments/environment";
import { NgHttpCachingConfig, NgHttpCachingModule, NgHttpCachingStrategy } from "ng-http-caching";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

export const serverCacheConfig = {
  cacheStrategy: NgHttpCachingStrategy.DISALLOW_ALL,
} as const satisfies NgHttpCachingConfig;

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    // Timeout API requests after set period
    BawTimeoutModule.forRoot({ timeout: environment.ssrTimeout }),
    // Cache explicit API requests
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
