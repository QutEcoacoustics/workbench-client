import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RehydrationInterceptorService } from "./rehydration.interceptor.service";

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RehydrationInterceptorService,
      multi: true,
    },
  ],
})
export class RehydrationModule {}
