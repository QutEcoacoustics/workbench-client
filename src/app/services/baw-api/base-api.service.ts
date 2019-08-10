import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { toCamelCase, toSnakeCase } from "src/app/helpers/case-converter";
import { User } from "src/app/interfaces/layout-menus.interfaces";

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export class BawApiService {
  constructor(protected http: HttpClient) {}

  private url = "https://staging.ecosounds.org";
  protected RETURN_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401
  };
  protected SESSION_STORAGE = {
    authToken: "authToken",
    username: "username",
    id: "id",
    role: "role"
  };

  isLoggedIn(): boolean {
    return !!this.getSessionToken();
  }

  /**
   * Username of the logged in user
   */
  get user(): User {
    return this.getSessionUser();
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  protected getSessionUser(): User | null {
    if (this.getSessionToken()) {
      return {
        username: sessionStorage.getItem(this.SESSION_STORAGE.username),
        id: parseInt(sessionStorage.getItem(this.SESSION_STORAGE.id), 10),
        role:
          sessionStorage.getItem(this.SESSION_STORAGE.role) === "Admin"
            ? "Admin"
            : "User"
      };
    } else {
      return null;
    }
  }

  /**
   * Retrieve session token. Null is no user exists
   */
  protected getSessionToken(): string | null {
    return sessionStorage.getItem(this.SESSION_STORAGE.authToken);
  }

  /**
   * Get the header options for a http request
   */
  protected getHeaderOptions() {
    const authToken = this.getSessionToken();
    let options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    };

    // Add token if it exists
    if (authToken) {
      options = {
        headers: options.headers.append(
          "Authorization",
          `Token token="${authToken}"`
        )
      };
    }

    return options;
  }

  /**
   * Returns the path for the api route
   * @param path Path fragment
   * @param args Args to modify path fragment
   */
  protected getPath(path: string, args?: PathArg) {
    // If arguments are given
    if (args) {
      // Replace fragment inputs
      if (args.args) {
        for (const key in args.args) {
          const value = args.args[key];
          if (value) {
            path = path.replace("{" + key + "}", value as string);
          }
        }
      }
      if (args.filters) {
        // Append filters to end of path
        path += "?";

        for (const key in args.filters) {
          const value = args.filters[key];
          if (value) {
            path += key + "=" + (value as string) + "&";
          }
        }

        // Remove last &
        path = path.substr(0, path.length - 1);
      }
    }

    return this.url + path;
  }

  /**
   * Convert json object to javascript object
   * @param obj Object to convert
   */
  protected convertJsonToJS(obj: any): any {
    // Convert from snake_case to camelCase
    return toCamelCase(obj);
  }

  /**
   * Convert javascript object to json object
   * @param obj Object to convert
   */
  protected convertJSToJson(obj: any): any {
    // Convert from camelCase to snake_case
    return toSnakeCase(obj);
  }

  /**
   * Writes error to console and throws error
   * @param error HTTP Error
   * @throws Observable<never>
   */
  protected handleError(error: HttpErrorResponse): Observable<string> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}: `, error);
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}

/**
 * Api meta data error output
 */
export interface MetaError {
  details: string;
  info: string;
}

/**
 * Api error response
 */
export interface ErrorResponse {
  meta: {
    status: number;
    message: string;
    error: {
      details: string;
    };
  };
}

/**
 * Api path argument
 */
export interface PathArg {
  args?: { [key: string]: any };
  filters?: { [key: string]: any };
}

/**
 * Api path fragment
 */
export interface Paths {
  [key: string]: {
    [key: string]: string;
  };
}
