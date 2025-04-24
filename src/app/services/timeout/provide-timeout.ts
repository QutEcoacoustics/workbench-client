import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Provider } from "@angular/core";
import {
  TIMEOUT_OPTIONS,
  TimeoutInterceptor,
  TimeoutOptions,
} from "./timeout.interceptor.service";

export function providerTimeoutInterceptor(
  options?: TimeoutOptions
): Provider[] {
  const interceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: TimeoutInterceptor,
    multi: true,
  };

  if (options) {
    return [
      interceptorProvider,
      { provide: TIMEOUT_OPTIONS, useValue: options },
    ];
  }

  return [interceptorProvider];
}
