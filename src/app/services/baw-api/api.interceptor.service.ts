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
import httpStatus from "http-status";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiResponse } from "./baw-api.service";
import { SecurityService } from "./security/security.service";

/**
 * BAW API Interceptor.
 * This handles intercepting http requests to the BAW API server and manages
 * login tokens and error handling.
 */
@Injectable()
export class BawApiInterceptor implements HttpInterceptor {
  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    public api: SecurityService
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

    // Only set these headers if this is a json request
    if (request.responseType === "json") {
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Accept: "application/json",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Content-Type": "application/json",
        },
      });
    }

    // If logged in, add authorization token
    if (this.api.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Token token="${this.api.getLocalUser().authToken}"`,
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
      catchError(this.handleError)
    );
  }

  /**
   * Writes error to console and throws error
   *
   * @param response HTTP Error
   * @throws Observable<never>
   */
  private handleError(
    response: HttpErrorResponse | ApiErrorResponse | ApiErrorDetails
  ): Observable<never> {
    // Convert incoming data
    response = toCamelCase(response);
    let error: ApiErrorDetails;

    if (isApiErrorDetails(response)) {
      error = response;
    } else if (isErrorResponse(response)) {
      error = {
        status: response.status,
        message: response.error.meta.error.details,
        info: response.error.meta.error?.info,
      };
    } else if (response.status === 0) {
      // Timeout library sets status to 0 if timed out
      // https://github.com/IKatsuba/ngx-ssr/issues/397
      error = {
        status: httpStatus.REQUEST_TIMEOUT,
        message:
          "Resource request took too long to complete. " +
          "This may be an issue with your connection to us, or a temporary issue with our services.",
      };
    } else {
      error = { status: response.status, message: response.message };
    }

    return throwError(error);
  }
}

/**
 * API Service error response
 */
export interface ApiErrorDetails {
  status: number;
  message: string;
  info?: any;
}

/**
 * BAW API raw error response
 */
interface ApiErrorResponse extends HttpErrorResponse {
  error: ApiResponse<null>;
}

/**
 * Determine if error response has already been processed
 *
 * @param errorResponse Error response
 */
export function isApiErrorDetails(
  errorResponse: any
): errorResponse is ApiErrorDetails {
  if (!errorResponse) {
    return false;
  }

  const keys = Object.keys(errorResponse);
  return (
    keys.length <= 3 && keys.includes("status") && keys.includes("message")
  );
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
