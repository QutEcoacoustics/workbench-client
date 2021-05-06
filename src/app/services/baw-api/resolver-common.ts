import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Tuple, Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageInfo } from "@helpers/page/pageInfo";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractData } from "@models/AbstractData";
import { AbstractModel } from "@models/AbstractModel";
import httpStatus from "http-status";
import { Observable, of } from "rxjs";
import { catchError, first, map } from "rxjs/operators";
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
  OutputModel extends
    | AbstractData
    | AbstractData[]
    | AbstractModel
    | AbstractModel[],
  ServiceModel extends AbstractModel,
  ServiceParams extends any[],
  Service extends
    | BawApiService<ServiceModel>
    | ApiList<ServiceModel, ServiceParams>
    | ApiFilter<ServiceModel, ServiceParams>
    | ApiShow<ServiceModel, ServiceParams, IdOr<ServiceModel>>
    | ApiCreate<ServiceModel, ServiceParams>
    | ApiUpdate<ServiceModel, ServiceParams>
    | ApiDestroy<ServiceModel, ServiceParams, IdOr<ServiceModel>>,
  ResolverName = { customResolver: string }
> {
  public constructor(
    /** Dependencies required for Service (including service) */
    protected serviceDeps: Type<Service>[],
    /** Unique ID of model to retrieve */
    protected uniqueId?: string,
    /** Parameters supplied to service request */
    protected params?: Tuple<string, ServiceParams["length"]>
  ) {}

  public create(
    name: string,
    required: boolean = false
  ): ResolverName & { providers: BawProvider[] } {
    // Store reference to 'this' values before 'this' is changed inside class
    const { uniqueId, params: serviceArgs, resolverFn } = this;

    class Resolver implements Resolve<ResolvedModel<OutputModel>> {
      public constructor(private api: Service) {}

      /**
       * Resolve the model
       *
       * @param route Route Snapshot
       */
      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<OutputModel>> {
        const modelId = this.getModelId(route);
        const additionalArgs = this.getServiceArguments(route);

        return resolverFn(route, this.api, modelId, additionalArgs).pipe(
          map((model) => ({ model })), // Modify output to match ResolvedModel interface
          first(), // Only take first response
          catchError((error: ApiErrorDetails) => {
            console.log({
              required,
              errStatus: error.status,
              code: httpStatus.NOT_FOUND,
            });
            if (!required && error.status === httpStatus.NOT_FOUND) {
              // Return undefined model if not required
              return of({ model: undefined });
            }
            // Modify output to match ResolvedModel interface
            return of({ error });
          })
        );
      }

      /**
       * Retrieve model id from route fragments and query parameters.
       * returns undefined if uniqueId is not required
       */
      private getModelId(route: ActivatedRouteSnapshot): Option<Id> {
        if (!isInstantiated(uniqueId)) {
          return undefined;
        }

        const id =
          route.paramMap.get(uniqueId) ?? route.queryParamMap.get(uniqueId);
        return convertToId(id);
      }

      /**
       * Retrieve additional service arguments from route fragments and query parameters.
       * Returns empty array if none required
       */
      private getServiceArguments(
        route: ActivatedRouteSnapshot
      ): ServiceParams {
        if (!serviceArgs || serviceArgs.length === 0) {
          return [] as ServiceParams;
        }

        return serviceArgs.map((urlId) => {
          const id =
            route.paramMap.get(urlId) ?? route.queryParamMap.get(urlId);
          return convertToId(id);
        }) as ServiceParams;
      }
    }

    return this.createProviders(name, Resolver, this.serviceDeps);
  }

  /**
   * Create providers required for app modules
   *
   * @param name Resolver name
   * @param resolver Resolver class
   * @param deps Resolver dependencies
   */
  public abstract createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<OutputModel>>>,
    deps: Type<Service>[]
  ): ResolverName & { providers: BawProvider[] };

  /**
   * Create resolver api request
   *
   * @param route Activated Route Snapshot
   * @param api Baw api service
   * @param id Model id
   * @param ids Additional id arguments
   */
  public abstract resolverFn(
    route: ActivatedRouteSnapshot,
    api: Service,
    id: Id,
    ids: ServiceParams
  ): Observable<OutputModel>;
}

/**
 * Resolvers Class.
 * This handles generating both the list and show resolves for a service.
 * Id's for the models are retrieved from the URL.
 */
export class Resolvers<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiList<Model, Params> &
    ApiShow<Model, Params, IdOr<Model>> = ApiList<Model, Params> &
    ApiShow<Model, Params, IdOr<Model>>
> {
  public constructor(
    private serviceDeps: Type<Service>[],
    private uniqueId?: string,
    private params?: Tuple<string, Params["length"]>
  ) {}

  /**
   * Create providers
   *
   * @param name Name of provider
   */
  public create(name: string) {
    const { serviceDeps, uniqueId, params } = this;
    const listResolver = new ListResolver<Model, Params, Service>(
      serviceDeps,
      params
    ).create(name);
    const showResolver = new ShowResolver<Model, Params, Service>(
      serviceDeps,
      uniqueId,
      params
    ).create(name);
    const showOptionalResolver = new ShowOptionalResolver<
      Model,
      Params,
      Service
    >(serviceDeps, uniqueId, params).create(name);

    return {
      ...listResolver,
      ...showResolver,
      ...showOptionalResolver,
      providers: [
        ...listResolver.providers,
        ...showResolver.providers,
        ...showOptionalResolver.providers,
      ],
    };
  }
}

/**
 * List Resolver Class.
 * This handles generating the resolver required for generating a list of models using
 * the id's stored in the URL.
 */
export class ListResolver<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiList<Model, Params> = ApiList<Model, Params>
> extends BawResolver<Model[], Model, Params, Service, { list: string }> {
  public constructor(
    deps: Type<Service>[],
    params?: Tuple<string, Params["length"]>
  ) {
    super(deps, undefined, params);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<Model[]>>>,
    deps: Type<Service>[]
  ) {
    return {
      list: name + "ListResolver",
      providers: [{ provide: name + "ListResolver", useClass: resolver, deps }],
    };
  }

  public resolverFn(_: any, api: Service, __: Id, ids: Params) {
    return api.list(...ids);
  }
}

/**
 * Show Resolver Class.
 * This handles generating the resolver required for generating a single model using
 * the id's stored in the URL.
 */
export class ShowResolver<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiShow<Model, Params, IdOr<Model>> = ApiShow<
    Model,
    Params,
    IdOr<Model>
  >
> extends BawResolver<Model, Model, Params, Service, { show: string }> {
  public constructor(
    deps: Type<Service>[],
    uniqueId?: string,
    params?: Tuple<string, Params["length"]>
  ) {
    super(deps, uniqueId, params);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<Model>>>,
    deps: Type<Service>[]
  ) {
    return {
      show: name + "ShowResolver",
      providers: [{ provide: name + "ShowResolver", useClass: resolver, deps }],
    };
  }

  public create(name: string, required: true = true) {
    return super.create(name, required);
  }

  public resolverFn(_: any, api: Service, id: Id, ids: Params) {
    return api.show(id, ...ids);
  }
}

/**
 * Show Optional Resolver Class.
 * This handles generating the resolver required for generating a single model using
 * the id's stored in the URL. If no model is found, or there is an error, this will
 * return undefined.
 */
export class ShowOptionalResolver<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiShow<Model, Params, IdOr<Model>> = ApiShow<
    Model,
    Params,
    IdOr<Model>
  >
> extends BawResolver<Model, Model, Params, Service, { showOptional: string }> {
  public constructor(
    deps: Type<Service>[],
    uniqueId?: string,
    params?: Tuple<string, Params["length"]>
  ) {
    super(deps, uniqueId, params);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<Model>>>,
    deps: Type<Service>[]
  ) {
    return {
      showOptional: name + "OptionalShowResolver",
      providers: [
        { provide: name + "OptionalShowResolver", useClass: resolver, deps },
      ],
    };
  }

  public create(name: string, required: false = false) {
    return super.create(name, required);
  }

  public resolverFn(_: any, api: Service, id: Id, ids: Params) {
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
 *
 * @param id ID parameter
 */
function convertToId(id: string): Id {
  return parseInt(id, 10);
}

/**
 * Verify all resolvers resolve without errors. Returns object containing all
 * resolved models using the resolver key as the object key.
 *
 * @param data Page Data
 */
export function retrieveResolvers(data: PageInfo): ResolvedModelList | false {
  const models = {};
  const keys = Object.keys(data?.resolvers || {});

  if (keys.length === 0) {
    console.warn("resolver-common: Failed to detect any resolvers");
    return models;
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
