import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { PageInfo } from "@helpers/page/pageInfo";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractData } from "@models/AbstractData";
import { AbstractModel } from "@models/AbstractModel";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import {
  ApiCreate,
  ApiDestroy,
  ApiFilter,
  ApiList,
  ApiShow,
  ApiUpdate,
  IdOr,
} from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";

/**
 * Baw Resolver Wrapper Class
 * This allows a service to define its own custom resolver
 */
export abstract class BawResolver<
  // Output Model
  O extends AbstractData | AbstractData[] | AbstractModel | AbstractModel[],
  // API Service Model
  M extends AbstractModel,
  // API Service
  A extends
    | BawApiService<M>
    | ApiList<M, any[]>
    | ApiFilter<M, any[]>
    | ApiShow<M, any[], IdOr<M>>
    | ApiCreate<M, any[]>
    | ApiUpdate<M, any[]>
    | ApiDestroy<M, any[], IdOr<M>>,
  // Resolver output model name
  T = { customResolver: string }
> {
  constructor(
    protected deps: Type<A>[],
    protected id?: string,
    protected ids?: string[]
  ) {}

  public create(name: string): T & { providers: BawProvider[] } {
    const id = this.id;
    const ids = this.ids;
    const resolverFn = this.resolverFn;

    class Resolver implements Resolve<ResolvedModel<O>> {
      constructor(private api: A) {}

      /**
       * Resolve the model
       * @param route Route Snapshot
       */
      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<O>> {
        // Grab Model ID from URL
        const modelId = id ? convertToId(route.paramMap.get(id)) : undefined;
        // Grab additional ID's from URL
        const args = ids
          ? ids.map((urlId) => convertToId(route.paramMap.get(urlId)))
          : [];

        return resolverFn(route, this.api, modelId, args).pipe(
          map((model) => ({ model })), // Modify output to match ResolvedModel interface
          take(1), // Only take first response
          catchError((error: ApiErrorDetails) => {
            return of({ error }); // Modify output to match ResolvedModel interface
          })
        );
      }
    }

    return this.createProviders(name, Resolver, this.deps);
  }

  /**
   * Create providers required for app modules
   * @param name Resolver name
   * @param resolver Resolver class
   * @param deps Resolver dependencies
   */
  public abstract createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<O>>>,
    deps: Type<A>[]
  ): T & { providers: BawProvider[] };

  /**
   * Create resolver api request
   * @param route Activated Route Snapshot
   * @param api Baw api service
   * @param id Model id
   * @param ids Additional id arguments
   */
  public abstract resolverFn(
    route: ActivatedRouteSnapshot,
    api: A,
    id: Id,
    ids: Id[]
  ): Observable<O>;
}

/**
 * Resolvers Class.
 * This handles generating both the list and show resolves for a service.
 * Id's for the models are retrieved from the URL.
 */
export class Resolvers<
  M extends AbstractModel,
  A extends ApiList<M, any[]> & ApiShow<M, any[], IdOr<M>>
> {
  constructor(
    private deps: Type<A>[],
    private id?: string,
    private ids?: string[]
  ) {}

  /**
   * Create providers
   * @param name Name of provider
   */
  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    const listProvider = new ListResolver<M, A>(deps, ids).create(name);
    const showProvider = new ShowResolver<M, A>(deps, id, ids).create(name);
    const providers = [...listProvider.providers, ...showProvider.providers];

    return { ...listProvider, ...showProvider, providers };
  }
}

/**
 * List Resolver Class.
 * This handles generating the resolver required for generating a list of models using
 * the id's stored in the URL.
 */
export class ListResolver<
  M extends AbstractModel,
  A extends ApiList<M, any[]>
> extends BawResolver<M[], M, A, { list: string }> {
  constructor(deps: Type<A>[], ids?: string[]) {
    super(deps, undefined, ids);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<M[]>>>,
    deps: Type<A>[]
  ) {
    return {
      list: name + "ListResolver",
      providers: [
        {
          provide: name + "ListResolver",
          useClass: resolver,
          deps,
        },
      ],
    };
  }

  public resolverFn(_: ActivatedRouteSnapshot, api: A, __: Id, ids: Id[]) {
    return api.list(...ids);
  }
}

/**
 * Show Resolver Class.
 * This handles generating the resolver required for generating a single model using
 * the id's stored in the URL.
 */
export class ShowResolver<
  M extends AbstractModel,
  A extends ApiShow<M, any[], IdOr<M>>
> extends BawResolver<M, M, A, { show: string }> {
  constructor(deps: Type<A>[], id?: string, ids?: string[]) {
    super(deps, id, ids);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<M>>>,
    deps: Type<A>[]
  ) {
    return {
      show: name + "ShowResolver",
      providers: [
        {
          provide: name + "ShowResolver",
          useClass: resolver,
          deps,
        },
      ],
    };
  }

  public resolverFn(_: ActivatedRouteSnapshot, api: A, id: Id, ids: Id[]) {
    return api.show(id, ...ids);
  }
}

/**
 * App provider details
 */
export interface BawProvider {
  provide: string;
  useClass: Type<Resolve<any>>;
  deps: Type<any>[];
}

/**
 * Resolver model output
 */
export interface ResolvedModel<
  T = AbstractModel | AbstractModel[] | AbstractData | AbstractData[]
> {
  model?: T;
  error?: ApiErrorDetails;
}

/**
 * Convert URL ID param to Id type
 * @param id ID parameter
 */
function convertToId(id: string): Id {
  return parseInt(id, 10);
}

/**
 * Verify all resolvers resolve without errors. Returns object containing all
 * resolved models using the resolver key as the object key.
 * @param data Page Data
 */
export function retrieveResolvers(data: PageInfo): ResolvedModelList | false {
  const models = {};
  const keys = Object.keys(data?.resolvers || {});

  if (keys.length === 0) {
    console.error("resolver-common: Failed to detect any resolvers");
    return false;
  }

  // Grab all models
  for (const key of keys) {
    const resolvedModel: ResolvedModel = data[key];

    // If error detected, return
    if (!resolvedModel || resolvedModel.error) {
      return false;
    }

    models[key] = resolvedModel.model;
  }

  return models;
}

export interface ResolvedModelList {
  [key: string]:
    | AbstractModel
    | AbstractModel[]
    | AbstractData
    | AbstractData[];
}
