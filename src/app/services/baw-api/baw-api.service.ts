import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { KeysOfType, Writeable, XOR } from "@helpers/advancedTypes";
import { toSnakeCase } from "@helpers/case-converter/case-converter";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { toBase64Url } from "@helpers/encoding/encoding";
import {
  AbstractModel,
  AbstractModelConstructor,
  AbstractModelWithoutId,
} from "@models/AbstractModel";
import { CacheSettings, CACHE_SETTINGS } from "@services/cache/cache-settings";
import { API_ROOT } from "@services/config/config.tokens";
import { ToastrService } from "ngx-toastr";
import { Observable, iif, of, throwError } from "rxjs";
import { catchError, concatMap, map, switchMap, tap } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import {
  NgHttpCachingConfig,
  NgHttpCachingService,
  withNgHttpCachingContext,
} from "ng-http-caching";
import { defaultCachingConfig } from "@services/cache/cache.module";
import { BawSessionService } from "./baw-session.service";
import { CREDENTIALS_CONTEXT } from "./api.interceptor.service";
import { BAW_SERVICE_OPTIONS } from "./api-common";

export const defaultApiPageSize = 25;
export const unknownErrorCode = -1;

export interface BawServiceOptions {
  /** If set and a request fails, an error notification won't be shown to the user */
  disableNotification?: boolean;

  /** If set, requests will include the users authentication token and cookies */
  withCredentials?: boolean;

  /** Allows you to modify the cashew cache options per request */
  cacheOptions?: NgHttpCachingConfig;
}

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

export const defaultBawServiceOptions = Object.freeze({
  disableNotification: false,
  withCredentials: true,
  cacheOptions: defaultCachingConfig,
}) satisfies Required<BawServiceOptions>;

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
    filterShow -> POST with filter body to create a model
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
   * @param req API request
   */
  private clearCache = (req: HttpRequest<any>) => {
    // this.cacheManager.deleteFromCache(req);
  };

  // because users can create a partial options object, we need to merge the partial options with the default options
  // so that we don't have "undefined" values being passed as options
  private buildServiceOptions(
    options: Partial<BawServiceOptions>
  ): Required<BawServiceOptions> {
    return {
      ...this.instanceOptions,
      ...options,
    };
  }

  private buildCachingOptions(options: Partial<BawServiceOptions>): NgHttpCachingConfig {
    return {
      ...this.instanceOptions.cacheOptions,
      ...options.cacheOptions,
    };
  }

  // the "context" headers are passed to the interceptor to determine if the request should be cached and if
  // the Authentication token and cookies should be sent in requests
  private withCredentialsHttpContext(
    options: Required<BawServiceOptions>,
    baseContext: HttpContext = new HttpContext()
  ): HttpContext {
    return baseContext.set(CREDENTIALS_CONTEXT, options.withCredentials);
  }

  // because users can input a partial options object, it is possible for the disableNotification property to be undefined
  // this can be a problem because it will default to a falsy value, not the default option
  // therefore, this method should be used to check if we should show a toast notification if the request fails
  private suppressErrors(options: Partial<BawServiceOptions>): boolean {
    const realizedOptions = this.buildServiceOptions(options);
    return realizedOptions.disableNotification;
  }

  private instanceOptions: Required<BawServiceOptions>;

  public constructor(
    @Inject(API_ROOT) protected apiRoot: string,
    @Inject(IS_SERVER_PLATFORM) protected isServer: boolean,
    protected cacheManager: NgHttpCachingService,
    protected http: HttpClient,
    protected session: BawSessionService,
    protected notifications: ToastrService,
    @Inject(CACHE_SETTINGS) private cacheSettings: CacheSettings,
    @Inject(ASSOCIATION_INJECTOR)
    protected associationInjector: AssociationInjector,
    @Optional() @Inject(BAW_SERVICE_OPTIONS) private options: BawServiceOptions
  ) {
    // by merging the default options with the injected options, we can override
    // the default options by injecting a partial options object
    // by having a full default options object, we can ensure that all options
    // are set
    //
    // the following order of precedence is used:
    // parameter options > injected options > default options
    this.instanceOptions = Object.assign(
      {},
      defaultBawServiceOptions,
      this.options
    );

    const createModel = (cb: ClassBuilder, data: Model, meta: Meta): Model => {
      const model = new cb(data, this.associationInjector);
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
   * Normalise errors thrown in API services to BawApiError's
   *
   * @param err Error
   * @param disableNotification If unset, a notification will be shown to the
   * user with the details of the error
   */
  public handleError = (
    err: BawApiError | Error,
    disableNotification?: boolean
  ): Observable<never> => {
    const error = isBawApiError(err)
      ? err
      : new BawApiError(unknownErrorCode, err.message);
    // Do not show error notifications during SSR, otherwise they cannot be
    // cleared
    if (!disableNotification && !this.isServer) {
      this.notifications.error(error.formattedMessage("<br />"));
    }
    return throwError((): BawApiError => error);
  };

  /**
   * Get response from list route
   *
   * @param classBuilder Model to create
   * @param path API path
   */
  public list(
    classBuilder: ClassBuilder,
    path: string,
    options: BawServiceOptions = {}
  ): Observable<Model[]> {
    return this.session.authTrigger.pipe(
      switchMap(() => this.httpGet(path, defaultApiHeaders, options)),
      map(this.handleCollectionResponse(classBuilder)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
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
    filters: Filters<Model>,
    options: BawServiceOptions = {}
  ): Observable<Model[]> {
    return this.session.authTrigger.pipe(
      switchMap(() => this.httpPost(path, filters, undefined, options)),
      map(this.handleCollectionResponse(classBuilder)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
    );
  }

  /**
   * Gets a model that was created from filter conditions
   *
   * @param classBuilder Model to create
   * @param path API path
   * @param filters API filters
   */
  public filterShow(
    classBuilder: ClassBuilder,
    path: string,
    filters: Filters<Model>,
    options: BawServiceOptions = {}
  ): Observable<Model> {
    return this.session.authTrigger.pipe(
      switchMap(() => this.httpPost(path, filters, undefined, options)),
      map(this.handleSingleResponse(classBuilder)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
    );
  }

  /**
   * Get response from show route
   *
   * @param classBuilder Model to create
   * @param path API path
   */
  public show(
    classBuilder: ClassBuilder,
    path: string,
    options: BawServiceOptions = {}
  ): Observable<Model> {
    return this.session.authTrigger.pipe(
      switchMap(() => this.httpGet(path, defaultApiHeaders, options)),
      map(this.handleSingleResponse(classBuilder)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
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
    model: AbstractModel,
    options: BawServiceOptions = {}
  ): Observable<Model> {
    const jsonData = model.getJsonAttributes?.({ create: true });
    const formData = model.getFormDataOnlyAttributes({ create: true });
    const body = model.kind
      ? { [model.kind]: jsonData ?? model }
      : jsonData ?? model;

    // as part of the multi part request, if there is only a JSON body, we want to return the output of the JSON POST request
    // if there is only a formData body, we want to return the output of the formData PUT request
    // if there is both a JSON body and formData, we want to return the output of the last request sent (formData PUT request)
    // we default to returning null if there is no JSON or formData body
    return of(null).pipe(
      concatMap(
        model.hasJsonOnlyAttributes({ create: true })
          ? () => this.httpPost(createPath, body, undefined, options).pipe()
          : (data) => of(data)
      ),
      // we create a class from the POST response so that we can construct an update route for the formData PUT request
      // using the updatePath callback. We do this before the concatMap below because the updatePath callback is dependent
      // on the instantiated class from the POST response object
      map(this.handleSingleResponse(classBuilder)),
      // using concatMap here ensures that the httpPost request completes before the httpPut request is made
      concatMap((data) =>
        // we use an if statement here because we want to create a new observable and apply a map function to it
        // using ternary logic here (similar to the update function) would result in poor readability and a lot of nesting
        iif(
          () => model.hasFormDataOnlyAttributes({ create: true }),
          this.httpPut(
            updatePath(data),
            formData,
            multiPartApiHeaders,
            options
          ).pipe(map(this.handleSingleResponse(classBuilder))),
          of(data)
        )
      ),
      // there is no map function here, because the handleSingleResponse method is invoked on the POST and PUT requests
      // individually. Moving the handleSingleResponse mapping here would result in the response object being instantiated twice
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
    );
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
    model: AbstractModel,
    options: BawServiceOptions = {}
  ): Observable<Model> {
    const jsonData = model.getJsonAttributes?.({ update: true });
    const formData = model.getFormDataOnlyAttributes({ update: true });
    const body = model.kind
      ? { [model.kind]: jsonData ?? model }
      : jsonData ?? model;

    // as part of the multi part request, if there is only a JSON body, we want to return the output of the JSON PATCH request
    // if there is only a formData body, we want to return the output of the formData PUT request
    // if there is both a JSON body and formData, we want to return the output of the last request sent (formData PUT request)
    // we default to returning null if there is no JSON or formData body
    return of(null).pipe(
      concatMap(
        // we use (data) => of(data) here instead of the identity function because the identify function
        // returns a value, and not an observable. Because we use concatMap below, we need the existing
        // value to be emitted as an observable instead. Therefore, we create a static observable using of()
        model.hasJsonOnlyAttributes({ update: true })
          ? () => this.httpPatch(path, body, undefined, options)
          : (data) => of(data)
      ),
      concatMap(
        model.hasFormDataOnlyAttributes({ update: true })
          ? () => this.httpPut(path, formData, multiPartApiHeaders, options)
          : (data) => of(data)
      ),
      map(this.handleSingleResponse(classBuilder)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
    );
  }

  /**
   * Get response from destroy route
   *
   * @param path API path
   */
  public destroy(
    path: string,
    options: BawServiceOptions = {}
  ): Observable<null> {
    return this.httpDelete(path, undefined, options).pipe(
      map(this.handleEmptyResponse),
      tap((req) => this.clearCache(req)),
      catchError((err) => this.handleError(err, this.suppressErrors(options)))
    );
  }

  /**
   * Constructs a `GET` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param headers Request headers
   *
   * @param options Options to modify the request
   * eg. `{ withCredentials: false }` will not include the users authentication token and cookies in the request
   */
  public httpGet(
    path: string,
    headers: HttpHeaders = defaultApiHeaders,
    options: BawServiceOptions = {}
  ): Observable<ApiResponse<Model | Model[]>> {
    const fullOptions = this.buildServiceOptions(options);

    const cachingOptions = this.buildCachingOptions(options);
    const cacheContext = withNgHttpCachingContext(cachingOptions);

    const context = this.withCredentialsHttpContext(fullOptions, cacheContext);

    return this.http.get<ApiResponse<Model>>(this.getPath(path), {
      responseType: "json",
      headers,
      context,
    });
  }

  /**
   * Constructs a `DELETE` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param headers Request headers
   *
   * @param options Options to modify the request
   * eg. `{ withCredentials: false }` will not include the users authentication token and cookies in the request
   */
  public httpDelete(
    path: string,
    headers: HttpHeaders = defaultApiHeaders,
    options: BawServiceOptions = {}
  ): Observable<ApiResponse<Model | void>> {
    const fullOptions = this.buildServiceOptions(options);

    const context = this.withCredentialsHttpContext(fullOptions);

    return this.http.delete<ApiResponse<null>>(this.getPath(path), {
      responseType: "json",
      headers,
      context,
    });
  }

  /**
   * Constructs a `POST` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param body Request body
   * @param headers Request headers
   *
   * @param options Options to modify the request
   * eg. `{ withCredentials: false }` will not include the users authentication token and cookies in the request
   */
  public httpPost(
    path: string,
    body?: any,
    headers: HttpHeaders = defaultApiHeaders,
    options: BawServiceOptions = {}
  ): Observable<ApiResponse<Model | Model[]>> {
    const fullOptions = this.buildServiceOptions(options);

    // we support caching filter requests by indexing the cache
    // by the base64 encoded filter body
    const cachingOptions = this.buildCachingOptions(options);
    const cacheContext = withNgHttpCachingContext(cachingOptions);

    const context = this.withCredentialsHttpContext(fullOptions, cacheContext);

    return this.http.post<ApiResponse<Model | Model[]>>(
      this.getPath(path),
      body,
      {
        responseType: "json",
        headers,
        context,
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
   * @param headers Request headers
   *
   * @param options Options to modify the request
   * eg. `{ withCredentials: false }` will not include the users authentication token and cookies in the request
   */
  public httpPut(
    path: string,
    body?: any,
    headers: HttpHeaders = defaultApiHeaders,
    options: BawServiceOptions = {}
  ): Observable<ApiResponse<Model>> {
    const fullOptions = this.buildServiceOptions(options);

    const context = this.withCredentialsHttpContext(fullOptions);

    return this.http.put<ApiResponse<Model>>(this.getPath(path), body, {
      responseType: "json",
      headers,
      context,
    });
  }

  /**
   * Constructs a `PATCH` request. Conversion of data types and error handling
   * are performed by the baw-api interceptor class. This will retrigger
   * whenever the users authenticated state changes.
   *
   * @param path API path
   * @param body Request body
   * @param headers Request headers
   *
   * @param options Options to modify the request
   * eg. `{ withCredentials: false }` will not include the users authentication token and cookies in the request
   */
  public httpPatch(
    path: string,
    body?: any,
    headers: HttpHeaders = defaultApiHeaders,
    options: BawServiceOptions = {}
  ): Observable<ApiResponse<Model>> {
    const fullOptions = this.buildServiceOptions(options);

    const context = this.withCredentialsHttpContext(fullOptions);

    return this.http.patch<ApiResponse<Model>>(this.getPath(path), body, {
      responseType: "json",
      headers,
      context,
    });
  }

  public encodeFilter(
    filter: Filters<Model>,
    disablePaging?: boolean,
    withCredentials: boolean = true
  ): string {
    const body: Record<string, string> = {
      // Base64 RFC 4648 §5 encoding
      filterEncoded: toBase64Url(JSON.stringify(toSnakeCase(filter))),
    };

    if (disablePaging) {
      body["disablePaging"] = "true";
    }

    if (this.session.isLoggedIn && withCredentials) {
      body["authToken"] = this.session.authToken;
    }

    return new URLSearchParams(toSnakeCase(body)).toString();
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
  ): Filters<Model> {
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
 * A serializable object that can be directly passed as the body for an API call
 *
 * @description
 * Objects that implement `.toJSON` or `.toString` are considered serializable as they are serialized by Angular's request body serializer
 */
export interface SerializableObject {
  toJSON(): string;
  toString(): string;
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
  eq?: string | number | boolean | SerializableObject;
  equal?: string | number | boolean | SerializableObject;
  notEq?: string | number | boolean | SerializableObject;
  notEqual?: string | number | boolean | SerializableObject;
  lt?: string | number | Expression | SerializableObject;
  lessThan?: string | number | Expression | SerializableObject;
  notLt?: string | number | Expression | SerializableObject;
  notLessThan?: string | number | Expression | SerializableObject;
  gt?: string | number | Expression | SerializableObject;
  greaterThan?: string | number | Expression | SerializableObject;
  notGt?: string | number | Expression | SerializableObject;
  notGreaterThan?: string | number | Expression | SerializableObject;
  lteq?: string | number | Expression | SerializableObject;
  lessThanOrEqual?: string | number | Expression | SerializableObject;
  notLteq?: string | number | Expression | SerializableObject;
  notLessThanOrEqual?: string | number | Expression | SerializableObject;
  gteq?: string | number | Expression | SerializableObject;
  greaterThanOrEqual?: string | number | Expression | SerializableObject;
  notGteq?: string | number | Expression | SerializableObject;
  notGreaterThanOrEqual?: string | number | Expression | SerializableObject;
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
