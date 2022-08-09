import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";
import { HttpCacheInterceptorModule } from "@ngneat/cashew";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { UniversalDeviceDetectorService } from "@services/universal-device-detector/universal-device-detector.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    // Timeout API requests after set period
    BawTimeoutModule.forRoot({ timeout: environment.ssrTimeout }),
    // Cache API requests
    HttpCacheInterceptorModule.forRoot({ strategy: "explicit" }),
  ],
  providers: [
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
