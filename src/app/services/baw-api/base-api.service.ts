import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AbstractModel } from "src/app/models/AbstractModel";
import { SessionUser } from "src/app/models/User";

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
export abstract class BawApiService<T extends AbstractModel> {
  /*
  Paths:
    list -> GET
    show -> GET with id
    create -> PUT/POST
    update -> PATCH with id
    destroy -> DELETE with ID
    filter -> POST with filter body
  */

  protected userSessionStorage = "baw.client.user";

  /**
   * Handle API response
   */
  private handleResponse: (_: ApiResponse<T>) => T[];
  private handleSingleResponse: (_: ApiResponse<T>) => T;

  // * @param nullResponse True if response body can be empty. If set, next always be called with "true"
  // {

  // next: <T>(response: ApiResponse<T>) => {
  //   if (response?.data) {
  //     next(response.data);
  //   } else if (!response && nullResponse) {
  //     // TODO Remove if https://github.com/QutEcoacoustics/baw-server/issues/427 is fixed
  //     next(true);
  //   } else {
  //     error({
  //       status: apiReturnCodes.unknown,
  //       message: "No data returned from API"
  //     } as ApiErrorDetails);
  //   }
  // },
  // error: (err: ApiErrorDetails) => {
  //   error(err);
  // }
  // };

  constructor(
    protected http: HttpClient,
    private apiRoot: string,
    _new: new (_: object) => T) {

    this.handleSingleResponse = (response: ApiResponse<T>) => {
      if (response.data instanceof Array) {
        throw new Error("Received an array of API results when only a single result was expected");
      }

      return new _new(response.data);
    };

    this.handleResponse = (response: ApiResponse<T>): T[] => {
      if (response.data instanceof Array) {
        return response.data.map(x => new _new(x));
      } else {
        return [new _new(response.data)];
      }
    };
  }

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
      // FIX: (AT) never swallow exceptions!
      return null;
    }
  }

  /**
   * Get response from details route
   * @param path API path
   * @param filters API filters
   */
  protected apiList(path: string) {
    return this.httpGet(path).pipe(map(this.handleResponse));
  }

  protected apiFilter(path: string, filters: Filters) {
    return this.httpPost(path, filters).pipe(map(this.handleResponse));
  }

  protected apiShow(path: string) {
    return this.httpGet(path).pipe(map(this.handleSingleResponse));
  }

  /**
   * Create request for API route
   * @param path API path
   * @param body Request body
   */
  protected apiCreate(path: string, body: T) {
    return this.httpPost(path, body as object).pipe(map(this.handleSingleResponse));
  }

  /**
   * Update request for API route
   * @param path API path
   * @param body Request body
   */
  protected apiUpdate(path: string, body: object) {
    return this.httpPatch(path, body).pipe(map(this.handleSingleResponse));
  }

  /**
   * Delete request for API route
   * @param path API path
   */
  protected apiDestroy(path: string) {
    return this.httpDelete(path).pipe(map(this.handleSingleResponse));
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   */
  protected httpGet(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.getPath(path));
  }

  /**
   * Constructs a `DELETE` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   */
  protected httpDelete(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.getPath(path));
  }

  /**
   * Constructs a `POST` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param body Request body
   */
  protected httpPost(path: string, body?: object): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.getPath(path), body);
  }

  /**
   * Constructs a `PATCH` request
   * Conversion of data types and error handling are performed by the base-api interceptor class.
   * @param path API path
   * @param body Request body
   */
  protected httpPatch(path: string, body?: object): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.getPath(path), body);
  }

  /**
   * Concatenates path with apiRoot to form a full URL.
   * @param path Path fragment
   */
  private getPath(path: string): string {
    return this.apiRoot + path;
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

export interface Meta extends Filters {
  status: number;
  message: string;
  error?: {
    details: string;
    info?: any;
  };
}

/**
 * API response
 */
export interface ApiResponse<T> {
  meta: Meta;
  data: T[] | T;
}
