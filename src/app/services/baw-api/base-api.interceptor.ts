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
      body: this.convertJSToJson(request.body)
    });

    return next.handle(request).pipe(
      // Convert incoming data
      map(resp => {
        if (resp instanceof HttpResponse) {
          return resp.clone({ body: this.convertJsonToJS(resp.body) });
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
  private handleError(response: HttpErrorResponse): Observable<never> {
    if (response.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", response.error.message);
      return throwError(
        new Error("Something bad happened; please try again later.")
      );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${response.status}: `, response);

      try {
        return throwError(new Error(response.error.meta.error.details));
      } catch (TypeError) {
        return throwError(new Error(response.message));
      }
    }
  }

  /**
   * Convert json object to javascript object
   * @param obj Object to convert
   */
  private convertJsonToJS(obj: any): any {
    // Convert from snake_case to camelCase
    return toCamelCase(obj);
  }

  /**
   * Convert javascript object to json object
   * @param obj Object to convert
   */
  private convertJSToJson(obj: any): any {
    // Convert from camelCase to snake_case
    return toSnakeCase(obj);
  }
}
