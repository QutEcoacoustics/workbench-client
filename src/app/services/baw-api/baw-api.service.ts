import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { KeysOfType, Writeable, XOR } from "@helpers/advancedTypes";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import {
  AbstractModel,
  AbstractModelConstructor,
  AbstractModelWithoutId,
} from "@models/AbstractModel";
import { HttpCacheManager, withCache } from "@ngneat/cashew";
import { ContextOptions } from "@ngneat/cashew/lib/cache-context";
import { withCacheLogging } from "@services/cache/cache-logging.service";
import { cacheSettings } from "@services/cache/cache-settings";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { BawSessionService } from "./baw-session.service";

export const defaultApiPageSize = 25;
export const unknownErrorCode = -1;

/** Default headers for API requests */
export const defaultApiHeaders = new HttpHeaders({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Accept: "application/json",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "Content-Type": "application/json",
});
/** Headers for MultiPart API requests */
export const multiPartApiHeaders = new HttpHeaders({
  // Do not set Content-Type for this request, otherwise web browsers wont calculate boundaries automatically
  // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Accept: "application/json",
});

/**
 * Interface with BAW Server Rest API
 */
@Injectable()
export class BawApiService<
  Model extends AbstractModelWithoutId,
  ClassBuilder extends AbstractModelConstructor<Model> = AbstractModelConstructor<Model>
> {
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
   * Handle API collection response
   *
   * @param cb AbstractModel class
   */
  public handleCollectionResponse: (
    cb: ClassBuilder
  ) => (resp: ApiResponse<Model>) => Model[];

  /**
   * Handle API single model response
   *
   * @param cb AbstractModel class
   */
  public handleSingleResponse: (
    cb: ClassBuilder
  ) => (resp: ApiResponse<Model>) => Model;

  /**
   * Handle API empty response
   */
  private handleEmptyResponse = () => null;

  /**
   * Clear an API call from the cache. Note: This does not currently work with
   * API requests which include QSP and may be an issue in the future.
   *
   * @param path API path
   */
  private clearCache = (path: string) => {
    this.manager.delete(path);
  };

  public constructor(
    @Inject(API_ROOT) protected apiRoot: string,
    @Inject(IS_SERVER_PLATFORM) protected isServer: boolean,
    protected manager: HttpCacheManager,
    protected http: HttpClient,
    protected injector: Injector,
    protected session: BawSessionService,
    protected notifications: ToastrService
  ) {
    const createModel = (cb: ClassBuilder, data: Model, meta: Meta): Model => {
      const model = new cb(data, this.injector);
      model.addMetadata(meta);
      return model;
    };

    this.handleCollectionResponse =
      (cb: ClassBuilder) =>
      (resp: ApiResponse<Model>): Model[] =>
        resp.data instanceof Array
          ? resp.data.map((data): Model => createModel(cb, data, resp.meta))
          : [createModel(cb, resp.data, resp.meta)];

    this.handleSingleResponse =
      (cb: ClassBuilder) =>
      (resp: ApiResponse<Model>): Model => {
        if (resp.data instanceof Array) {
          throw new Error(
            "Received an array of API results when only a single result was expected"
          );
        }
        return createModel(cb, resp.data, resp.meta);
      };
  }

  /**
   * Handle custom Errors thrown in API services
   *
   * @param err Error
   */
  public handleError(err: BawApiError | Error): Observable<never> {
    const error = isBawApiError(err)
      ? err
      : new BawApiError(unknownErrorCode, err.message);

    this.notifications.error(error.formattedMessage("<br />"), undefined, {
      disableTimeOut: true,
    });
    return throwError(() => error);
  }

  /**
   * Get response from list route
   *
   * @param classBuilder Model to create
   * @param path API path
   */
  public list(classBuilder: ClassBuilder, path: string): Observable<Model[]> {
    return this.session.authTrigger.pipe(
      switchMap(() =>
        this.httpGet(path, defaultApiHeaders, { cache: cacheSettings.enabled })
      ),
      map(this.handleCollectionResponse(classBuilder))
    );
  }

  /**
   * Get response from filter route
   *
   * @param classBuilder Model to create
   * @param path API path
   * @param filters API filters
   */
  public filter(
    classBuilder: ClassBuilder,
    path: string,
    filters: Filters<Model>
  ): Observable<Model[]> {
    return this.session.authTrigger.pipe(
      switchMap(() => this.httpPost(path, filters)),
      map(this.handleCollectionResponse(classBuilder))
    );
  }

  /**
   * Get response from show route
   *
   * @param classBuilder Model to create
   * @param path API path
   */
  public show(classBuilder: ClassBuilder, path: string): Observable<Model> {
    return this.session.authTrigger.pipe(
      switchMap(() =>
        this.httpGet(path, defaultApiHeaders, { cache: cacheSettings.enabled })
      ),
      map(this.handleSingleResponse(classBuilder))
    );
  }

  /**
   * Get response from create route. If the model has form data only attributes,
   * this will make an additional update request.
   *
   * @param classBuilder Model to create
   * @param createPath API create path
   * @param updatePath API update path
   * @param model Model to insert into API request
   */
  public create(
    classBuilder: ClassBuilder,
    createPath: string,
    updatePath: (model: Model) => string,
    model: AbstractModel
  ): Observable<Model> {
    const jsonData = model?.getJsonAttributes?.({ create: true });
    const body = model.kind
      ? { [model.kind]: jsonData ?? model }
      : jsonData ?? model;

    const request = this.httpPost(createPath, body).pipe(
      map(this.handleSingleResponse(classBuilder))
    );

    if (model?.hasFormDataOnlyAttributes({ create: true })) {
      const formData = model.getFormDataOnlyAttributes({ create: true });
      return request.pipe(
        mergeMap((data) =>
          this.httpPut(updatePath(data), formData, multiPartApiHeaders)
        ),
        map(this.handleSingleResponse(classBuilder))
      );
    }

    return request;
  }

  /**
   * Get response from update route. If the model has form data only attributes,
   * this will make an additional multipart update request.
   *
   * @param classBuilder Model to create
   * @param path API path
   * @param model Model to insert into API request
   */
  public update(
    classBuilder: ClassBuilder,
    path: string,
    model: AbstractModel
  ): Observable<Model> {
    const jsonData = model.getJsonAttributes?.({ update: true });
    const request = this.httpPatch(path, jsonData ?? model).pipe(
      map(this.handleSingleResponse(classBuilder))
    );

    if (model?.hasFormDataOnlyAttributes({ update: true })) {
      const formData = model.getFormDataOnlyAttributes({ update: true });
      return request.pipe(
        mergeMap(() => this.httpPut(path, formData, multiPartApiHeaders)),
        map(this.handleSingleResponse(classBuilder))
      );
    }
    return request.pipe(tap(() => this.clearCache(path)));
  }

  /**
   * Get response from destroy route
   *
   * @param path API path
   */
  public destroy(path: string): Observable<null> {
    return this.httpDelete(path).pipe(
      map(this.handleEmptyResponse),
      tap(() => this.clearCache(path))
    );
  }

  /**
   * Constructs a `GET` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   */
  public httpGet(
    path: string,
    options: any = defaultApiHeaders,
    cacheOptions: ContextOptions = { cache: false }
  ): Observable<ApiResponse<Model | Model[]>> {
    return this.http.get<ApiResponse<Model>>(this.getPath(path), {
      responseType: "json",
      headers: options,
      context: withCache({
        ttl: cacheSettings.httpGetTtlMs,
        context: withCacheLogging(),
        ...cacheOptions,
      }),
    });
  }

  /**
   * Constructs a `DELETE` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   */
  public httpDelete(
    path: string,
    options: any = defaultApiHeaders
  ): Observable<ApiResponse<Model | void>> {
    return this.http.delete<ApiResponse<null>>(this.getPath(path), {
      responseType: "json",
      headers: options,
    });
  }

  /**
   * Constructs a `POST` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param body Request body
   */
  public httpPost(
    path: string,
    body?: any,
    options: any = defaultApiHeaders
  ): Observable<ApiResponse<Model | Model[]>> {
    return this.http.post<ApiResponse<Model | Model[]>>(
      this.getPath(path),
      body,
      {
        responseType: "json",
        headers: options,
      }
    );
  }

  /**
   * Constructs a `PUT` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param body Request body
   */
  public httpPut(
    path: string,
    body?: any,
    options: any = defaultApiHeaders
  ): Observable<ApiResponse<Model>> {
    return this.http.put<ApiResponse<Model>>(this.getPath(path), body, {
      responseType: "json",
      headers: options,
    });
  }

  /**
   * Constructs a `PATCH` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param body Request body
   */
  public httpPatch(
    path: string,
    body?: any,
    options: any = defaultApiHeaders
  ): Observable<ApiResponse<Model>> {
    return this.http.patch<ApiResponse<Model>>(this.getPath(path), body, {
      responseType: "json",
      headers: options,
    });
  }

  /**
   * Modify a base filter to to add an association to a model
   *
   * @param filters Base Filters
   * @param key Foreign key
   * @param model Foreign key value (if undefined, returns base filters)
   * @param comparison Comparison to be performed
   */
  public filterThroughAssociation(
    filters: Filters<Model>,
    key: AssociationKeys<Model>,
    model: AbstractModel | string | number,
    comparison: keyof (Comparisons & Subsets) = "eq"
  ): Filters<Model> {
    return this.associationFilter(filters, key, model, comparison);
  }

  /**
   * Modify a base filter to add an association to another group of model
   *
   * @param filters Base Filters
   * @param key Foreign key
   * @param models Foreign key values (if undefined, returns base filters)
   * @param comparison Comparison to be performed
   */
  public filterThroughAssociations(
    filters: Filters<Model>,
    key: AssociationKeys<Model>,
    models: string[] | number[],
    comparison: keyof Subsets = "in"
  ) {
    return this.associationFilter(filters, key, models, comparison);
  }

  /**
   * Concatenates path with apiRoot to form a full URL.
   *
   * @param path Path fragment beginning with a `/`
   */
  public getPath(path: string): string {
    return this.apiRoot + path;
  }

  /**
   * Modify a base filter to add an association to another model/group of models
   *
   * @param filters Base Filters
   * @param key Foreign key
   * @param models Foreign key value (if undefined, returns base filters)
   * @param comparison Comparison to be performed
   */
  private associationFilter(
    filters: Filters<Model>,
    key: AssociationKeys<Model>,
    models: AbstractModel | string | number | string[] | number[],
    comparison: keyof (Comparisons & Subsets)
  ): Filters<Model> {
    const { filter, ...meta } = filters;

    // Only return if model is undefined, not null (which is a valid input)
    if (models === undefined) {
      return filters;
    }

    return {
      ...meta,
      filter: {
        ...filter,
        [key]: {
          [comparison]: models instanceof AbstractModel ? models.id : models,
        },
      },
    };
  }
}

/**
 * Model keys which may be a valid association to another model
 */
type AssociationKeys<Model extends AbstractModel> = KeysOfType<
  Model,
  number | string | Set<string> | Set<number>
>;

export type Direction = "desc" | "asc";

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

/**
 * Date filter expressions
 * https://github.com/QutEcoacoustics/baw-server/wiki/API:-Filtering#supported-expressions
 *
 * @param time_of_day Extract the time fraction from a date
 * @param local_tz Convert a date to local date. Requires a date that can infer
 * its timezone. Must come before `time_of_day`
 * @param local_offset Convert a date to local date with a fixed UTC offset.
 * Requires a date that can infer its timezone. Must come before
 * `time_of_day`
 */
export type DateExpressions = "local_offset" | "local_tz" | "time_of_day";

/**
 * Filter expressions
 * https://github.com/QutEcoacoustics/baw-server/wiki/API:-Filtering#expressions-experimental
 */
export interface Expression {
  expressions: (DateExpressions | string)[];
  value: string;
}

export interface Comparisons {
  eq?: string | number;
  equal?: string | number;
  notEq?: string | number;
  notEqual?: string | number;
  lt?: string | number | Expression;
  lessThan?: string | number | Expression;
  notLt?: string | number | Expression;
  notLessThan?: string | number | Expression;
  gt?: string | number | Expression;
  greaterThan?: string | number | Expression;
  notGt?: string | number | Expression;
  notGreaterThan?: string | number | Expression;
  lteq?: string | number | Expression;
  lessThanOrEqual?: string | number | Expression;
  notLteq?: string | number | Expression;
  notLessThanOrEqual?: string | number | Expression;
  gteq?: string | number | Expression;
  greaterThanOrEqual?: string | number | Expression;
  notGteq?: string | number | Expression;
  notGreaterThanOrEqual?: string | number | Expression;
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
export type InnerFilter<Model = unknown> = Combinations<Writeable<Model>> &
  Comparisons &
  Subsets & {
    [P in keyof Writeable<Model>]?: Combinations<Writeable<Model>> &
      Comparisons &
      Subsets;
  };

/**
 * Filter metadata from api response
 * https://github.com/QutEcoacoustics/baw-server/wiki/API:-Filtering
 */
export interface Filters<Model = unknown, K extends keyof Model = keyof Model> {
  /** Filter settings */
  filter?: InnerFilter<Writeable<Model>>;
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

export type CapabilityKey = string | number;

export interface Capability {
  can: boolean;
  details: string | null;
}

/**
 * Metadata from api response
 */
export interface Meta<
  Model = unknown,
  Capabilities extends CapabilityKey = CapabilityKey
> extends Filters<Model> {
  /** Response status */
  status?: number;
  /** Human readable response status */
  message?: string;
  /** User capabilities */
  capabilities?: Record<Capabilities | CapabilityKey, Capability>;
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
  meta: Meta<T | unknown>;
  /** Response data */
  data: T[] | T;
}
