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

@Injectable()
export class BawApiInterceptor implements HttpInterceptor {
  constructor(public api: BawApiService) {}

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
    response: HttpErrorResponse | ErrorResponse
  ): Observable<never> {
    if (response.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", response.error.message);
      return throwError({
        code: response.status,
        message: response.message
      });
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${response.status}: `, response);

      try {
        return throwError({
          code: response.status,
          message: response.error.meta.error.details
        });
      } catch (TypeError) {
        return throwError({
          code: response.status,
          message: response.message
        });
      }
    }
  }
}

export interface APIError {
  code: number;
  message: string;
}
/**
 * Api error response
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
