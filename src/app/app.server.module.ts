import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { NgxSsrCacheModule } from "@ngx-ssr/cache";
import { NgxSsrTimeoutModule } from "@ngx-ssr/timeout";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // Http request maximum timeout
    NgxSsrTimeoutModule.forRoot({ timeout: 100 }),
    // Cache http requests
    NgxSsrCacheModule.configLruCache({ maxAge: 10 * 60_000, maxSize: 50 }),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
