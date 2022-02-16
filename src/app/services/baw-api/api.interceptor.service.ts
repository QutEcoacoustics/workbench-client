import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import {
  toCamelCase,
  toSnakeCase,
} from "@helpers/case-converter/case-converter";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { BAD_GATEWAY, NOT_FOUND } from "http-status";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BawSessionService } from "./baw-session.service";
import { ApiResponse } from "./baw-api.service";

/**
 * BAW API Interceptor.
 * This handles intercepting http requests to the BAW API server and manages
 * login tokens and error handling.
 */
@Injectable()
export class BawApiInterceptor implements HttpInterceptor {
  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    public session: BawSessionService
  ) {}

  /**
   * Intercept http requests and handle appending login tokens and errors.
   * This interceptor also handles converting the variable names in json objects
   * from snake case to camel case, and back again for outgoing and ingoing requests.
   *
   * @param request Http Request
   * @param next Function to be run after interceptor
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.includes(this.apiRoot)) {
      return next.handle(request);
    }

    // If logged in, add authorization token
    if (this.session.isLoggedIn) {
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Token token="${this.session.authToken}"`,
        },
      });
    }

    // Convert outgoing data
    request = request.clone({
      withCredentials: true,
      body: toSnakeCase(request.body),
    });

    // Convert http parameter data (GET Requests)
    const oldParams = request.clone().params;
    let newParams = new HttpParams();
    const keys = oldParams.keys();

    for (const key of keys) {
      const value = oldParams.get(key);

      // Need to it this way so that whitelisted key values are respected in conversion
      let converted = {};
      converted[key] = value;
      converted = toSnakeCase(converted);

      newParams = newParams.set(
        Object.keys(converted)[0],
        converted[Object.keys(converted)[0]]
      );
    }

    request = request.clone({ params: newParams });

    return next.handle(request).pipe(
      // Convert incoming data
      map((response) =>
        response instanceof HttpResponse
          ? response.clone({ body: toCamelCase(response.body) })
          : response
      ),
      catchError((response) => this.handleError(response))
    );
  }

  /**
   * Writes error to console and throws error
   *
   * @param response HTTP Error
   * @throws Observable<never>
   */
  private handleError(
    response: HttpErrorResponse | ApiErrorResponse | BawApiError
  ): Observable<never> {
    // Interceptor has already handled this error
    if (isBawApiError(response)) {
      return throwError(() => response);
    }

    // Standard API error response, extract relevant data
    if (isErrorResponse(response)) {
      const error = new BawApiError(
        response.status,
        response.error.meta.error.details,
        toCamelCase(response.error.meta.error?.info)
      );
      return throwError(() => error);
    }

    // Response timed out
    if (response.status === 0) {
      const error = new BawApiError(
        BAD_GATEWAY,
        "Unable to reach our servers right now." +
          "This may be an issue with your connection to us, " +
          "or a temporary issue with our services."
      );
      return throwError(() => error);
    }

    // Response returned 404 without hitting API route
    if (response.status === NOT_FOUND) {
      const error = new BawApiError(
        NOT_FOUND,
        "The following action does not exist, " +
          "if you believe this is an error please report a problem."
      );
      return throwError(() => error);
    }

    // Unknown error occurred, throw generic error
    console.error("Unknown error occurred: ", response);
    return throwError(() => new BawApiError(response.status, response.message));
  }
}

/**
 * BAW API raw error response
 */
interface ApiErrorResponse extends HttpErrorResponse {
  error: ApiResponse<null>;
}

/**
 * Determine if error response is from API
 *
 * @param errorResponse Error response
 */
function isErrorResponse(
  errorResponse: any
): errorResponse is ApiErrorResponse {
  return !!(errorResponse as ApiErrorResponse)?.error?.meta?.error?.details;
}
