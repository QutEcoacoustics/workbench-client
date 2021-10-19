import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // Http request maximum timeout with 100ms limit
    BawTimeoutModule.forRoot({ timeout: 100 }),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
