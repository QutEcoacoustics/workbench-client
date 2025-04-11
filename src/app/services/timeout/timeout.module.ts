import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, ModuleWithProviders } from "@angular/core";
import {
  TIMEOUT_OPTIONS,
  TimeoutInterceptor,
  TimeoutOptions,
} from "./timeout.interceptor.service";

@NgModule({
  imports: [CommonModule],
})
export class BawTimeoutModule {
  public static forRoot(
    options?: TimeoutOptions
  ): ModuleWithProviders<BawTimeoutModule> {
    return {
      ngModule: BawTimeoutModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TimeoutInterceptor,
          multi: true,
        },
        options
          ? {
              provide: TIMEOUT_OPTIONS,
              useValue: options,
            }
          : [],
      ],
    };
  }
}
