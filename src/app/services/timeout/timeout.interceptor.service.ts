import { Inject, Injectable, InjectionToken } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
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
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  public constructor(
    @Inject(TIMEOUT_OPTIONS) private timeoutOptions: TimeoutOptions
  ) {}

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
      catchError((error) => {
        if (error && error.name === "TimeoutError") {
          return throwError(
            new HttpErrorResponse({ error, url: request.urlWithParams })
          );
        }

        return throwError(error);
      })
    );
  }
}
