import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
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
    user: "user"
  };

  public isLoggedIn(): boolean {
    return !!this.getSessionUser();
  }

  /**
   * Username of the logged in user
   */
  public get user(): User | null {
    return this.getSessionUser();
  }

  /**
   * Constructs a `GET` request
   * @param path API path
   */
  protected get<T>(path: string, args?: PathArg): Observable<T | string> {
    return this.http
      .get(this.getPath(path, args), this.getHeaderOptions())
      .pipe(
        map(data => this.convertJsonToJS(data)),
        catchError(this.handleError)
      );
  }

  /**
   * Constructs a `POST` request
   * @param path API path
   */
  protected post<T>(
    path: string,
    args?: PathArg,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: "body";
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: "json";
      withCredentials?: boolean;
    }
  ): Observable<T | string> {
    return this.http
      .post(this.getPath(path, args), options, this.getHeaderOptions())
      .pipe(
        map(data => this.convertJsonToJS(data)),
        catchError(this.handleError)
      );
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  protected getSessionUser(): User | null {
    let user: User;
    try {
      user = JSON.parse(
        sessionStorage.getItem(this.SESSION_STORAGE.user)
      ) as User;
    } catch (Exception) {
      user = null;
    }

    return user;
  }

  /**
   * Get the header options for a http request
   */
  private getHeaderOptions() {
    const user = this.getSessionUser();
    let options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    };

    // Add token if it exists
    if (user) {
      options = {
        headers: options.headers.append(
          "Authorization",
          `Token token="${user.authToken}"`
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
  private getPath(path: string, args?: PathArg): string {
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

        // Convert filter
        const convertedFilters = this.convertJSToJson(args.filters);

        for (const key in convertedFilters) {
          const value = convertedFilters[key];
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

  /**
   * Writes error to console and throws error
   * @param error HTTP Error
   * @throws Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<string> {
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

/**
 * Default filter for routes
 */
export interface Filter {
  direction?: "asc" | "desc";
  items?: number;
  orderBy?: string;
  page?: number;
}

/**
 * List of items from route
 */
export interface List {
  meta: {
    status: number;
    message: string;
    error?: MetaError;
    sorting: {
      orderBy: string;
      direction: string;
    };
    paging: {
      page: number;
      items: number;
      total: number;
      maxPage: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: any[];
}
