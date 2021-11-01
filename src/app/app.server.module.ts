import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
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
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
