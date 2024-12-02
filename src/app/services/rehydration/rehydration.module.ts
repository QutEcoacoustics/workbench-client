import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RehydrationInterceptorService } from "./rehydration.interceptor.service";

@NgModule({
  imports: [],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RehydrationInterceptorService,
      multi: true,
    },
  ],
})
export class RehydrationModule {}
