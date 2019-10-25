import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
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
import { environment } from "src/environments/environment";
import { BawApiService } from "./base-api.service";

/**
 * BAW API Interceptor.
 * This handles intercepting http requests to the BAW API server and manages
 * login tokens and error handling.
 */
@Injectable()
export class BawApiInterceptor implements HttpInterceptor {
  constructor(public api: BawApiService) {}

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
    if (!request.url.includes(environment.bawApiUrl)) {
      return;
    }

    request = request.clone({
      setHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    // If logged in, add authorization token
    if (this.api.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token token="${this.api.getUser().authToken}"`
        }
      });
    }

    // Convert outgoing data
    request = request.clone({
      body: toSnakeCase(request.body)
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
    response: HttpErrorResponse | ErrorResponse | APIError
  ): Observable<never> {
    if (isErrorResponse(response)) {
      return throwError({
        status: response.status,
        message: response.error.meta.error.details
      });
    } else {
      return throwError({
        status: response.status,
        message: response.message
      });
    }
  }
}

/**
 * API Service error response
 */
export interface APIError {
  status: number;
  message: string;
}

/**
 * BAW API raw error response
 */
interface ErrorResponse extends HttpErrorResponse {
  error: {
    meta: {
      status: number;
      message: string;
      error: {
        details: string;
      };
    };
  };
}

function isErrorResponse(
  errorResponse: ErrorResponse | APIError | HttpErrorResponse
): errorResponse is ErrorResponse {
  return "error" in errorResponse && !(errorResponse instanceof ErrorEvent);
}
