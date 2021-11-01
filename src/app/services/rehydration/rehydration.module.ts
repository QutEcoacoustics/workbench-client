import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserTransferStateModule } from "@angular/platform-browser";
import { RehydrationInterceptorService } from "./rehydration.interceptor.service";

@NgModule({
  imports: [BrowserTransferStateModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RehydrationInterceptorService,
      multi: true,
    },
  ],
})
export class RehydrationModule {}
