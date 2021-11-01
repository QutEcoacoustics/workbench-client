import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import {
  makeStateKey,
  StateKey,
  TransferState,
} from "@angular/platform-browser";
import httpStatus from "http-status";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

const STATE_KEY_PREFIX = "http_requests:";

/**
 * This service handles caching and rehydrating the data sent from the API when
 * transitioning between the SSR and the browser. This interceptor is built off
 * the example code here:
 * https://medium.com/@alireza.mirian/reusing-server-side-http-responses-in-front-end-when-using-ssr-in-angular-970d3efaea59
 */
@Injectable()
export class RehydrationInterceptorService implements HttpInterceptor {
  public constructor(
    @Inject(IS_SERVER_PLATFORM) private isSsr: boolean,
    private transferState: TransferState
  ) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ignore any requests which are not GET or filter
    const isGetRequest = req.method === "GET";
    const isFilterRequest = req.url.endsWith("/filter");
    if (!isGetRequest && !isFilterRequest) {
      return next.handle(req);
    }

    // Predict key for request in state transfer, and intercept request
    const key = makeStateKey<HttpResponse<any>>(STATE_KEY_PREFIX + req.url);
    return this.isSsr
      ? this.interceptServerRequests(req, next, key)
      : this.interceptBrowserRequests(req, next, key);
  }

  /**
   * Intercept browser request. If this is the first request after SSR, and the
   * request exists in the transferred state, return the cached value. This will
   * clear the cache for that request immediately after to reduce caching
   * issues
   */
  private interceptBrowserRequests(
    req: HttpRequest<any>,
    next: HttpHandler,
    key: StateKey<HttpResponse<any>>
  ): Observable<HttpEvent<any>> {
    // Try reusing transferred response from server
    const cachedResponse = this.transferState.get(key, null);

    // If no cached value, or the user is authed, let the original request go through
    if (!cachedResponse || req.headers.has("Authorization")) {
      return next.handle(req);
    }

    this.transferState.remove(key); // cached response should be used for the very first time
    return of(
      new HttpResponse({
        body: cachedResponse.body,
        status: httpStatus.OK,
        statusText: "OK (from server)",
        headers: cachedResponse.headers,
      })
    );
  }

  /**
   * Intercept server side renderer request. Save the results of the request to
   * the state, and sent it to the browser when it rehydrates. Only parts of the
   * initial request are cached because http responses contain cyclical
   * relationships
   */
  private interceptServerRequests(
    req: HttpRequest<any>,
    next: HttpHandler,
    key: StateKey<HttpResponse<any>>
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === httpStatus.OK) {
          /*
           * Only transferring body because http responses are not POJO and
           * would require a custom serialization/deserialization solution
           */
          const response = { body: event.body, headers: event.headers };
          this.transferState.set(key, response);
        }
      })
    );
  }
}
