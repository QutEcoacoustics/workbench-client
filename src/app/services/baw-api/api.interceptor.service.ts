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
  constructor(
    @Inject(API_ROOT) private apiRoot: string,
    public api: SecurityService
  ) {}

  /**
   * Intercept http requests and handle appending login tokens and errors.
   * This interceptor also handles converting the variable names in json objects
   * from snake case to camel case, and back again for outgoing and ingoing requests.
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

    // Don't add these headers to requests to cms service
    if (request.responseType !== "text") {
      request = request.clone({
        setHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    }

    // If logged in, add authorization token
    if (this.api.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token token="${this.api.getLocalUser().authToken}"`,
        },
      });
    }

    // Convert outgoing data
    request = request.clone({
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

    request = request.clone({
      params: newParams,
    });

    return next.handle(request).pipe(
      // Convert incoming data
      map((response) => {
        if (response instanceof HttpResponse) {
          return response.clone({ body: toCamelCase(response.body) });
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Writes error to console and throws error
   * @param response HTTP Error
   * @throws Observable<never>
   */
  private handleError(
    response: HttpErrorResponse | ApiErrorResponse | ApiErrorDetails
  ): Observable<never> {
    // Convert incoming data
    response = toCamelCase(response);
    let error: ApiErrorDetails;

    if (isErrorDetails(response)) {
      error = response;
    } else if (isErrorResponse(response)) {
      error = {
        status: response.status,
        message: response.error.meta.error.details,
        info: response.error.meta.error?.info,
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
 * @param errorResponse Error response
 */
function isErrorDetails(
  errorResponse: ApiErrorResponse | ApiErrorDetails | HttpErrorResponse
): errorResponse is ApiErrorDetails {
  const keys = Object.keys(errorResponse);
  return (
    keys.length <= 3 && keys.includes("status") && keys.includes("message")
  );
}

/**
 * Determine if error response is from API
 * @param errorResponse Error response
 */
function isErrorResponse(
  errorResponse: ApiErrorResponse | ApiErrorDetails | HttpErrorResponse
): errorResponse is ApiErrorResponse {
  return !!(errorResponse as ApiErrorResponse).error?.meta?.error?.details;
}
