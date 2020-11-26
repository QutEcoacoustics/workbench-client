import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  PLATFORM_ID,
} from "@angular/core";
import { XOR } from "@helpers/advancedTypes";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { AbstractModel } from "@models/AbstractModel";
import { SessionUser } from "@models/User";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export const defaultApiPageSize = 25;

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
  internalServerFailure: 500,
};

export const STUB_MODEL_BUILDER = new InjectionToken("test.model.builder");

/**
 * Interface with BAW Server Rest API
 */
@Injectable()
export abstract class BawApiService<Model extends AbstractModel> {
  private platform: any;

  /*
  Paths:
    list -> GET
    show -> GET with id
    create -> PUT/POST
    update -> PATCH with id
    destroy -> DELETE with ID
    filter -> POST with filter body
  */

  /**
   * User local storage location
   */
  protected userLocalStorageKey = "baw.client.user";

  /**
   * Handle API collection response
   *
   * @param response Api Response
   */
  private handleCollectionResponse: (response: ApiResponse<Model>) => Model[];

  /**
   * Handle API single model response
   *
   * @param response Api Response
   */
  private handleSingleResponse: (response: ApiResponse<Model>) => Model;

  /**
   * Handle API empty response
   */
  private handleEmptyResponse(): null {
    return null;
  }

  public constructor(
    protected http: HttpClient,
    @Inject(API_ROOT) private apiRoot: string,
    @Inject(STUB_MODEL_BUILDER)
    classBuilder: new (_: Record<string, any>, _injector?: Injector) => Model,
    protected injector: Injector
  ) {
    this.platform = injector.get(PLATFORM_ID);

    // Create pure functions to prevent rebinding of 'this'
    this.handleCollectionResponse = (response: ApiResponse<Model>): Model[] => {
      if (response.data instanceof Array) {
        return response.data.map((data) => {
          const model = new classBuilder(data, this.injector);
          model.addMetadata(response.meta);
          return model;
        });
      } else {
        const model = new classBuilder(response.data, this.injector);
        model.addMetadata(response.meta);
        return [model];
      }
    };

    this.handleSingleResponse = (response: ApiResponse<Model>) => {
      if (response.data instanceof Array) {
        throw new Error(
          "Received an array of API results when only a single result was expected"
        );
      }

      const model = new classBuilder(response.data, this.injector);
      model.addMetadata(response.meta);
      return model;
    };
  }

  /**
   * Determine if the user is currently logged in
   */
  public isLoggedIn(): boolean {
    const user = this.getLocalUser();
    return user ? !!user.authToken : false;
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  public getLocalUser(): SessionUser | undefined {
    // local storage does not exist on server
    if (!isPlatformBrowser(this.platform)) {
      return undefined;
    }

    // Will return null if no item exists
    // TODO: resolve via injectable - accessing a global like this is not compatible with SSR
    const userData = localStorage.getItem(this.userLocalStorageKey);

    if (userData) {
      // Try create session user
      try {
        return new SessionUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to create session user: ", err);
        this.clearSessionUser();
      }
    }

    return undefined;
  }

  /**
   * Add user session data to the local storage
   *
   * @param user User details
   */
  protected storeLocalUser(user: SessionUser): void {
    localStorage.setItem(this.userLocalStorageKey, JSON.stringify(user));
  }

  /**
   * Clear session storage
   */
  protected clearSessionUser(): void {
    localStorage.removeItem(this.userLocalStorageKey);
  }

  /**
   * Get response from list route
   *
   * @param path API path
   */
  protected apiList(path: string): Observable<Model[]> {
    return this.httpGet(path).pipe(map(this.handleCollectionResponse));
  }

  /**
   * Get response from filter route
   *
   * @param path API path
   * @param filters API filters
   */
  protected apiFilter(
    path: string,
    filters: Filters<Model>
  ): Observable<Model[]> {
    return this.httpPost(path, filters).pipe(
      map(this.handleCollectionResponse)
    );
  }

  /**
   * Get response from show route
   *
   * @param path API path
   */
  protected apiShow(path: string): Observable<Model> {
    return this.httpGet(path).pipe(map(this.handleSingleResponse));
  }

  /**
   * Get response from create route
   *
   * @param path API path
   * @param body Request body
   */
  protected apiCreate(path: string, body: AbstractModel): Observable<Model> {
    return this.httpPost(path, body.toJSON?.() ?? body).pipe(
      map(this.handleSingleResponse)
    );
  }

  /**
   * Get response from update route
   * TODO Add option to switch between Put and Patch requests
   *
   * @param path API path
   * @param body Request body
   */
  protected apiUpdate(path: string, body: AbstractModel): Observable<Model> {
    return this.httpPatch(path, body.toJSON?.() ?? body).pipe(
      map(this.handleSingleResponse)
    );
  }

  /**
   * Get response from destroy route
   *
   * @param path API path
   */
  protected apiDestroy(path: string): Observable<Model | void> {
    return this.httpDelete(path).pipe(map(this.handleEmptyResponse));
  }

  /**
   * Constructs a `GET` request
   * Conversion of data types and error handling are performed by the baw-api interceptor class.
   *
   * @param path API path
   */
  protected httpGet(path: string): Observable<ApiResponse<Model | Model[]>> {
    return this.http.get<ApiResponse<Model>>(this.getPath(path));
  }

  /**
   * Constructs a `DELETE` request
   * Conversion of data types and error handling are performed by the baw-api interceptor class.
   *
   * @param path API path
   */
  protected httpDelete(path: string): Observable<ApiResponse<Model | void>> {
    return this.http.delete<ApiResponse<null>>(this.getPath(path));
  }

  /**
   * Constructs a `POST` request
   * Conversion of data types and error handling are performed by the baw-api interceptor class.
   *
   * @param path API path
   * @param body Request body
   */
  protected httpPost(path: string, body?: any): Observable<ApiResponse<Model>> {
    return this.http.post<ApiResponse<Model>>(this.getPath(path), body);
  }

  /**
   * Constructs a `PATCH` request
   * Conversion of data types and error handling are performed by the baw-api interceptor class.
   *
   * @param path API path
   * @param body Request body
   */
  protected httpPatch(
    path: string,
    body?: any
  ): Observable<ApiResponse<Model>> {
    return this.http.patch<ApiResponse<Model>>(this.getPath(path), body);
  }

  /**
   * Concatenates path with apiRoot to form a full URL.
   *
   * @param path Path fragment
   */
  private getPath(path: string): string {
    return this.apiRoot + path;
  }
}

/**
 * Sorting metadata from api response
 */
export interface Sorting<K> {
  /** Which key to sort by */
  orderBy: K;
  /** Sorting direction */
  direction: "desc" | "asc";
}

/**
 * Filter paging metadata from api response
 */
export interface Paging {
  /** Current page number */
  page?: number;
  /** Maximum number of items per page */
  items?: number;
  /** Total number of items for filter request */
  total?: number;
  /** Maximum page number */
  maxPage?: number;
}

export interface Combinations<T> {
  and?: InnerFilter<T>;
  or?: InnerFilter<T>;
  not?: InnerFilter<T>;
}

export interface Comparisons {
  eq?: string | number;
  equal?: string | number;
  notEq?: string | number;
  notEqual?: string | number;
  lt?: number;
  lessThan?: number;
  notLt?: number;
  notLessThan?: number;
  gt?: number;
  greaterThan?: number;
  notGt?: number;
  notGreaterThan?: number;
  lteq?: number;
  lessThanOrEqual?: number;
  notLteq?: number;
  notLessThanOrEqual?: number;
  gteq?: number;
  greaterThanOrEqual?: number;
  notGteq?: number;
  notGreaterThanOrEqual?: number;
}

/**
 * Runtime type checking of range intervals. This follows the pattern
 * set here: https://github.com/QutEcoacoustics/baw-server/wiki/API:-Filtering
 */
export class RangeInterval {
  public constructor(public interval: string) {
    const regex = /(\[|\()(.*),(.*)(\)|\])/;
    if (!regex.test(this.interval)) {
      throw Error("Range Interval: Invalid pattern provided");
    }
  }

  public toJSON() {
    return { interval: this.interval };
  }
}

type Range =
  | string[]
  | number[]
  | XOR<RangeInterval, { from: number; to: number }>;

export interface Subsets {
  range?: Range;
  inRange?: Range;
  notRange?: Range;
  notInRange?: Range;
  in?: string[] | number[];
  notIn?: string[] | number[];
  contains?: string;
  contain?: string;
  notContains?: string;
  doesNotContain?: string;
  startsWith?: string;
  startWith?: string;
  notStartsWith?: string;
  notStartWith?: string;
  doesNotStartWith?: string;
  endsWith?: string;
  endWith?: string;
  notEndsWith?: string;
  notEndWith?: string;
  regex?: RegExp;
  regexMatch?: RegExp;
  matches?: RegExp;
  notRegex?: RegExp;
  notRegexMatch?: RegExp;
  doesNotMatch?: RegExp;
  notMatch?: RegExp;
}

/**
 * Api response inner filter
 */
export type InnerFilter<T = unknown> = Combinations<T> &
  Comparisons &
  Subsets &
  { [P in keyof T]?: Combinations<T> & Comparisons & Subsets };

/**
 * Filter metadata from api response
 * https://github.com/QutEcoacoustics/baw-server/wiki/API:-Filtering
 */
export interface Filters<T = unknown, K extends keyof T = keyof T> {
  /** Filter settings */
  filter?: InnerFilter<T>;
  /** Include or exclude keys from response */
  projection?: {
    /** Include keys in response */
    include?: K[];
    /** Exclude keys from response */
    exclude?: K[];
  };
  /** Current sorting options */
  sorting?: Sorting<K>;
  /** Current page data */
  paging?: Paging;
}

/**
 * Metadata from api response
 */
export interface Meta<T = unknown> extends Filters<T> {
  /** Response status */
  status?: number;
  /** Human readable response status */
  message?: string;
  /** Optional error metadata */
  error?: {
    /** Error message */
    details: string;
    /** Additional info */
    info?: { [key: string]: string[] };
  };
}

/**
 * API response
 */
export interface ApiResponse<T> {
  /** Response metadata */
  meta: Meta;
  /** Response data */
  data: T[] | T;
}
