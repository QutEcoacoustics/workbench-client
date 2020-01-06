import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export abstract class BawApiService {
  /*
  Paths:
    details -> GET
    show -> GET with id
    create -> PUT/POST
    update -> PATCH with id
    destroy -> DELETE with ID
    filter -> POST with filter body
  */

  constructor(protected http: HttpClient, protected config: AppConfigService) {}

  private url = this.config.getConfig().environment.apiRoot;

  protected paths: Paths;
  protected userSessionStorage = "user";

  public apiReturnCodes = {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    unsupportedMediaType: 415,
    unprocessableEntity: 422,
    internalServerFailure: 500
  };

  public isLoggedIn(): boolean {
    const user = this.getSessionUser();
    return user ? !!user.authToken : false;
  }

  /**
   * Get response from details route
   * @param subject Subject to update
   * @param next Callback function which generates the model
   * @param path API path
   * @param args API arguments
   * @param filters API filters
   */
  protected details(
    subject: Subject<any>,
    next: (data: any) => any,
    path: string,
    args?: PathArg,
    filters?: Filters
  ) {
    let params = new HttpParams();
    for (const filter in filters) {
      params = params.set(filter, filters[filter]);
    }

    this.get<APIResponse>(path, args, params).subscribe({
      next: (data: APIResponse) => {
        if (data.data) {
          subject.next(next(data.data));
          subject.complete();
        } else {
          subject.error({
            status: 0,
            message: "No data returned from API"
          } as APIErrorDetails);
        }
      },
      error: (err: APIErrorDetails) => {
        subject.error(err);
      }
    });
  }

  /**
   * Filtered request for API route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param args API arguments
   * @param body Request body
   * @param options Request options
   */
  protected filter(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    args?: PathArg,
    body?: { filter: any },
    options?: RequestOptions
  ) {
    this.post<APIResponse>(path, args, body, options).subscribe(
      this.handleResponse(next, error)
    );
  }

  /**
   * Create request for API route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param args API arguments
   * @param body Request body
   * @param options Request options
   */
  protected create(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    args?: PathArg,
    body?: any,
    options?: RequestOptions
  ) {
    this.post<APIResponse>(path, args, body, options).subscribe(
      this.handleResponse(next, error)
    );
  }

  /**
   * Update request for API route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param args API arguments
   * @param body Request body
   * @param options Request options
   */
  protected update(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    args?: PathArg,
    body?: any,
    options?: RequestOptions
  ) {
    this.patch<APIResponse>(path, args, body, options).subscribe(
      this.handleResponse(next, error)
    );
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param args API arguments
   * @param options Request options
   */
  protected get<T>(
    path: string,
    args?: PathArg,
    params?: HttpParams
  ): Observable<T> {
    return this.http.get<T>(this.getPath(path, args), { params });
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param args API arguments
   * @param options Request options
   */
  protected delete<T>(
    path: string,
    args?: PathArg,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.delete<T>(this.getPath(path, args), options);
  }

  /**
   * Constructs a `POST` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param args API arguments
   * @param body Request body
   * @param options Request options
   */
  protected post<T>(
    path: string,
    args?: PathArg,
    body?: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.post<T>(this.getPath(path, args), body, options);
  }

  /**
   * Constructs a `PATCH` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param args API arguments
   * @param body Request body
   * @param options Request options
   */
  protected patch<T>(
    path: string,
    args?: PathArg,
    body?: any,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.patch<T>(this.getPath(path, args), body, options);
  }

  /**
   * Handle API response
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   */
  private handleResponse(next: (data: any) => void, error: (err: any) => void) {
    return {
      next: (data: APIResponse) => {
        if (data.data) {
          next(data.data);
        } else {
          error("No data returned from API");
        }
      },
      error: (err: APIErrorDetails) => {
        error(err);
      }
    };
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  public getSessionUser(): SessionUser | null {
    let user: SessionUser;
    try {
      user = new SessionUser(
        JSON.parse(sessionStorage.getItem(this.userSessionStorage))
      );
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
  protected getPath(path: string, args?: PathArg): string {
    // If arguments are given
    if (args) {
      // Replace fragment inputs
      if (args.args) {
        for (const key in args.args) {
          // $2 allows the replacement to add the '/' character if it exists in the original string
          path = path.replace(
            new RegExp(`(:${key})(\/?)`),
            args.args[key] + "$2"
          );
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
  [key: string]: string;
}

/**
 * Default filter for routes
 */
export interface Filters {
  direction?: "asc" | "desc";
  items?: number;
  orderBy?: string;
  page?: number;
}

/**
 * API response
 */
export interface APIResponse {
  meta: {
    status: number;
    message: string;
    error?: MetaError;
  };
  data: any;
}

export interface RequestOptions {
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

/**
 * API response containing a list of data
 */
export interface APIResponseList extends APIResponse {
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
