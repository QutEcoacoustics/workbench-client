import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  toCamelCase,
  toSnakeCase
} from "src/app/helpers/case-converter/case-converter";
import { User } from "src/app/models/User";
import { environment } from "src/environments/environment";

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export class BawApiService {
  constructor(protected http: HttpClient) {}

  private url = environment.bawApiUrl;
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
  public getUser(): User | null {
    return this.getSessionUser();
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   */
  protected get<T>(path: string, args?: PathArg): Observable<T> {
    return this.http.get<T>(this.getPath(path, args));
  }

  /**
   * Constructs a `POST` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   */
  protected post<T>(
    path: string,
    args?: PathArg,
    options?: any
  ): Observable<T> {
    return this.http.post<T>(this.getPath(path, args), options);
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  private getSessionUser(): User | null {
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
          path = path.replace("{" + key + "}", value as string);
        }
      }
      if (args.filters) {
        // Append filters to end of path
        path += "?";

        for (const key in args.filters) {
          const value = args.filters[key];
          path += key + "=" + (value as string) + "&";
        }

        // Remove last &
        path = path.substr(0, path.length - 1);
      }
    }

    return this.url + path;
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
