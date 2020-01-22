import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";

export const apiReturnCodes = {
  unknown: -1,
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

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export abstract class BawApiService {
  /*
  Paths:
    list -> GET
    show -> GET with id
    create -> PUT/POST
    update -> PATCH with id
    destroy -> DELETE with ID
    filter -> POST with filter body
  */

  private url = this.config.getConfig().environment.apiRoot;
  protected userSessionStorage = "user";

  constructor(private http: HttpClient, private config: AppConfigService) {}

  /**
   * Determine if the user is currently logged in
   */
  public isLoggedIn(): boolean {
    const user = this.getSessionUser();
    return user ? !!user.authToken : false;
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  public getSessionUser(): SessionUser | null {
    try {
      return new SessionUser(
        JSON.parse(sessionStorage.getItem(this.userSessionStorage))
      );
    } catch (Exception) {
      return null;
    }
  }

  /**
   * Get response from details route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param args URL arguments
   * @param filters API filters
   */
  protected apiList(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    filters?: Filters
  ) {
    if (!filters) {
      this.get<APIResponse>(path).subscribe(this.handleResponse(next, error));
    } else {
      this.post<APIResponse>(path + "/filter", filters).subscribe(
        this.handleResponse(next, error)
      );
    }
  }

  /**
   * Create request for API route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param body Request body
   * @param options Request options
   */
  protected apiCreate(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    body?: any,
    options?: RequestOptions
  ) {
    this.post<APIResponse>(path, body, options).subscribe(
      this.handleResponse(next, error)
    );
  }

  /**
   * Update request for API route
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param path API path
   * @param body Request body
   * @param options Request options
   */
  protected apiUpdate(
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    body?: object,
    options?: RequestOptions
  ) {
    this.patch<APIResponse>(path, body, options).subscribe(
      this.handleResponse(next, error)
    );
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param args URL arguments
   * @param options Request options
   */
  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.getPath(path), { params });
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param options Request options
   */
  protected delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.getPath(path), options);
  }

  /**
   * Constructs a `POST` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param body Request body
   * @param options Request options
   */
  protected post<T>(
    path: string,
    body?: object,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.post<T>(this.getPath(path), body, options);
  }

  /**
   * Constructs a `PATCH` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param body Request body
   * @param options Request options
   */
  protected patch<T>(
    path: string,
    body?: object,
    options?: RequestOptions
  ): Observable<T> {
    return this.http.patch<T>(this.getPath(path), body, options);
  }

  /**
   * Returns the path for the api route
   * @param path Path fragment
   * @param args Args to modify path fragment
   */
  protected getPath(path: string): string {
    return this.url + path;
  }

  /**
   * Handle API response
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   */
  private handleResponse<T>(
    next: (data: any) => void,
    error: (err: any) => void
  ) {
    return {
      next: (response: APIResponse) => {
        if (response.data) {
          next(response.data);
        } else {
          error({
            status: apiReturnCodes.unknown,
            message: "No data returned from API"
          } as APIErrorDetails);
        }
      },
      error: (err: APIErrorDetails) => {
        error(err);
      }
    };
  }
}

/**
 * Default filter for routes
 */
export interface Filters {
  filter?: any;
  projection?: {
    include: string[];
    exclude: string[];
  };
  sort?: {
    orderBy: string;
    direction: "desc" | "asc";
  };
  paging?: {
    page?: number;
    items?: number;
    total?: number;
    maxPage?: number;
    current?: string;
    previous?: string;
    next?: string;
  };
}

/**
 * API response
 */
export interface APIResponse {
  meta: {
    status: number;
    message: string;
    error?: {
      details: string;
      info: any;
    };
    sorting?: {
      orderBy: string;
      direction: string;
    };
    paging?: {
      page: number;
      items: number;
      total: number;
      maxPage: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: any;
}

/**
 * HTTP Request Options
 */
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
