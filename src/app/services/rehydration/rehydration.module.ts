import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser"; // Import the BrowserTransferStateModule
import { NgModule } from "@angular/core";
import { RehydrationInterceptorService } from "./rehydration.interceptor.service";

@NgModule({
  imports: [BrowserModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RehydrationInterceptorService,
      multi: true,
    },
  ],
})
export class RehydrationModule {}
