import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AbstractModel } from "src/app/models/AbstractModel";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";

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
  private apiRoot: string;

  /**
   * Handle API collection response
   * @param response Api Response
   */
  private handleCollectionResponse: (response: ApiResponse<T>) => T[];

  /**
   * Handle API single model response
   * @param response Api Response
   */
  private handleSingleResponse: (response: ApiResponse<T>) => T;

  /**
   * Handle API empty response
   */
  private handleEmptyResponse(): null {
    return null;
  }

  constructor(
    protected http: HttpClient,
    config: AppConfigService,
    classBuilder: new (_: object) => T
  ) {
    this.apiRoot = config.getConfig().environment.apiRoot;

    // Create pure functions to prevent rebinding of 'this'

    this.handleCollectionResponse = (response: ApiResponse<T>): T[] => {
      if (response.data instanceof Array) {
        return response.data.map(x => new classBuilder(x));
      } else {
        return [new classBuilder(response.data)];
      }
    };

    this.handleSingleResponse = (response: ApiResponse<T>) => {
      if (response.data instanceof Array) {
        throw new Error(
          "Received an array of API results when only a single result was expected"
        );
      }

      return new classBuilder(response.data);
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
    // Will return null if no item exists
    const userData = sessionStorage.getItem(this.userSessionStorage);

    if (userData) {
      // Try create session user
      try {
        return new SessionUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to create session user: ", err);
        this.clearSessionUser();
      }
    }

    return null;
  }

  /**
   * Add user details to the session storage
   * @param user User details
   */
  protected setSessionUser(user: SessionUser): void {
    sessionStorage.setItem(this.userSessionStorage, JSON.stringify(user));
  }

  /**
   * Clear session storage
   */
  protected clearSessionUser(): void {
    sessionStorage.removeItem(this.userSessionStorage);
  }

  /**
   * Get response from list route
   * @param path API path
   */
  protected apiList(path: string) {
    return this.httpGet(path).pipe(map(this.handleCollectionResponse));
  }

  /**
   * Get response from filter route
   * @param path API path
   * @param filters API filters
   */
  protected apiFilter(path: string, filters: Filters) {
    return this.httpPost(path, filters).pipe(
      map(this.handleCollectionResponse)
    );
  }

  /**
   * Get response from show route
   * @param path API path
   */
  protected apiShow(path: string) {
    return this.httpGet(path).pipe(map(this.handleSingleResponse));
  }

  /**
   * Get response from create route
   * @param path API path
   * @param body Request body
   */
  protected apiCreate(path: string, body: object) {
    return this.httpPost(path, body).pipe(map(this.handleSingleResponse));
  }

  /**
   * Get response from update route
   * @param path API path
   * @param body Request body
   */
  protected apiUpdate(path: string, body: object) {
    return this.httpPatch(path, body).pipe(map(this.handleSingleResponse));
  }

  /**
   * Get response from destroy route
   * @param path API path
   */
  protected apiDestroy(path: string) {
    return this.httpDelete(path).pipe(map(this.handleEmptyResponse));
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
  protected httpDelete(path: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(this.getPath(path));
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
 * Filter metadata from api response
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
 * Metadata from api response
 */
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
