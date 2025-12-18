import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, InjectionToken, inject } from "@angular/core";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { REQUEST_TIMEOUT } from "http-status";
import { NEVER, Observable, of, throwError } from "rxjs";
import { catchError, startWith, switchMap, timeout } from "rxjs/operators";

export interface TimeoutOptions {
  timeout: number;
}

export const TIMEOUT_OPTIONS = new InjectionToken<TimeoutOptions>(
  "Timeout Options",
  {
    factory() {
      return { timeout: null };
    },
  }
);

/**
 * Timeout interceptor. This will terminate any requests which exceed the timeout value set in the project root.
 *
 * @author IKatsuba (Igor Katsuba)
 * @link https://github.com/IKatsuba/ngx-ssr
 */
@Injectable({ providedIn: "root" })
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly timeoutOptions = inject<TimeoutOptions>(TIMEOUT_OPTIONS);

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      switchMap((event) => {
        if (event.type === HttpEventType.Sent && this.timeoutOptions.timeout) {
          return NEVER.pipe(
            startWith(event),
            timeout(this.timeoutOptions.timeout)
          );
        }

        return of(event);
      }),
      catchError((error: Error) => {
        if (error?.name === "TimeoutError") {
          return throwError(
            () =>
              new BawApiError(
                REQUEST_TIMEOUT,
                "Resource request took too long to complete. " +
                  "This may be an issue with your connection to us, or a temporary issue with our services.",
                {}
              )
          );
        }

        return throwError(() => error);
      })
    );
  }
}
