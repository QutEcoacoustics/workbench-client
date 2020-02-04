import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  toCamelCase,
  toSnakeCase
} from "src/app/helpers/case-converter/case-converter";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiResponse, BawApiService } from "./base-api.service";
import { SecurityService } from "./security.service";

/**
 * BAW API Interceptor.
 * This handles intercepting http requests to the BAW API server and manages
 * login tokens and error handling.
 */
@Injectable()
export class BawApiInterceptor implements HttpInterceptor {
  constructor(public api: SecurityService, private config: AppConfigService) {}

  /**
   * Intercept http requests and handle appending login tokens and errors.
   * This interceptor also handles converting the variable names in json objects
   * from snake case to camel case, and back again for outgoing and ingoing requests.
   * @param request Http Request
   * @param next Function to be run after interceptor
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request.url.includes(this.config.getConfig().environment.apiRoot) &&
      !request.url.includes(this.config.getConfig().environment.cmsRoot)
    ) {
      return next.handle(request);
    }

    // Don't add these headers to requests to cms service
    if (request.responseType !== "text") {
      request = request.clone({
        setHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
    }

    // If logged in, add authorization token
    if (this.api.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token token="${this.api.getSessionUser().authToken}"`
        }
      });
    }

    // Convert outgoing data
    request = request.clone({
      body: toSnakeCase(request.body)
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
      params: newParams
    });

    return next.handle(request).pipe(
      // Convert incoming data
      map(resp => {
        if (resp instanceof HttpResponse) {
          return resp.clone({ body: toCamelCase(resp.body) });
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
    if (isErrorDetails(response)) {
      return throwError(response);
    } else if (isErrorResponse(response)) {
      const error: ApiErrorDetails = {
        status: response.status,
        message: response.error.meta.error.details
      };

      if (response.error.meta.error.info) {
        error.info = response.error.meta.error.info;
      }

      return throwError(error);
    } else {
      return throwError({
        status: response.status,
        message: response.message
      } as ApiErrorDetails);
    }
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
  return (
    errorResponse["status"] &&
    errorResponse["message"] &&
    Object.keys(errorResponse).length <= 3
  );
}

/**
 * Determine if error response is from API
 * @param errorResponse Error response
 */
function isErrorResponse(
  errorResponse: ApiErrorResponse | ApiErrorDetails | HttpErrorResponse
): errorResponse is ApiErrorResponse {
  return (
    errorResponse["error"] &&
    errorResponse["error"]["meta"] &&
    errorResponse["error"]["meta"]["error"] &&
    errorResponse["error"]["meta"]["error"]["details"]
  );
}
