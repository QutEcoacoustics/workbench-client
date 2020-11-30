import { PartialWith } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Observable } from "rxjs";
import { BawApiService, Filters } from "./baw-api.service";

/**
 * Variable is an id or AbstractModel
 */
export type IdOr<T extends AbstractModel> = T | number;

/**
 * Variable is an id or parameter
 */
export type IdParam<T extends AbstractModel> = (_: IdOr<T>) => string;

/**
 * Variable is optional id or parameter
 */
export type IdParamOptional<T extends AbstractModel> = (
  _: IdOr<T> | Empty
) => string;
export function id<T extends AbstractModel>(x: IdOr<T> | Empty) {
  if (x === emptyParam) {
    return x;
  } else if (isInstantiated(x?.["id"])) {
    return x?.["id"].toString();
  } else {
    return x.toString();
  }
}

/**
 * Create parameter (used by stringTemplate)
 *
 * @param x Api parameter
 */
export function param(x: Param) {
  return x;
}

/**
 * Create option (used by stringTemplate)
 *
 * @param x Api option
 */
export function option(x?: New | Filter | Empty) {
  return x ? x : emptyParam;
}

export type Empty = "";
export type New = "new";
export type Filter = "filter";
export const emptyParam: Empty = "";
export const newParam: New = "new";
export const filterParam: Filter = "filter";

/**
 * API List functionality
 */
export interface ApiList<
  Model extends AbstractModel,
  Params extends any[] = []
> {
  /**
   * Get list of models
   *
   * @param args URL parameter values
   */
  list(...urlParameters: Params): Observable<Model[]>;
}

/**
 * API Filter functionality
 */
export interface ApiFilter<
  ModelFilters extends Filters<any, any>,
  Model extends AbstractModel,
  Params extends any[] = []
> {
  /**
   * Get list of models, but filtered using the filter API
   *
   * @param args URL parameter values
   */
  filter(filters: ModelFilters, ...urlParameters: Params): Observable<Model[]>;
}

/**
 * API Show functionality
 */
export interface ApiShow<
  Model extends AbstractModel,
  Params extends any[] = [],
  Identifier extends IdOr<Model> = IdOr<Model>
> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  show(model: Model | Identifier, ...urlParameters: Params): Observable<Model>;
}

/**
 * API Create functionality
 */
export interface ApiCreate<
  Model extends AbstractModel,
  Params extends any[] = []
> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  create(model: Model, ...urlParameters: Params): Observable<Model>;
}

/**
 * API Update functionality
 */
export interface ApiUpdate<
  Model extends AbstractModel,
  Params extends any[] = []
> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  update(
    model: PartialWith<Model, "id">,
    ...urlParameters: Params
  ): Observable<Model>;
}
/**
 * API Delete functionality
 */
export interface ApiDestroy<
  Model extends AbstractModel,
  Params extends any[] = [],
  Identifier extends IdOr<Model> = IdOr<Model>
> {
  /**
   * destroy  individual model
   *
   * @param args URL parameter values
   */
  destroy(
    model: Identifier,
    ...urlParameters: Params
  ): Observable<Model | void>;
}

/**
 * Api Class with all abilities enabled
 */
export abstract class StandardApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params>,
    ApiCreate<Model, Params>,
    ApiUpdate<Model, Params>,
    ApiDestroy<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract create(
    model: Model,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract update(
    model: PartialWith<Model, "id">,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract destroy(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model | void>;
}

/**
 * Api Class without the ability to update a model
 */
export abstract class ImmutableApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params>,
    ApiCreate<Model, Params>,
    ApiDestroy<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract create(
    model: Model,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract destroy(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model | void>;
}

/**
 * Api Class with only readable abilities enabled
 */
export abstract class ReadonlyApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
}

/**
 * Api Class with only the ability to Read and Create models
 */
export abstract class ReadAndCreateApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params>,
    ApiCreate<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract create(
    model: Model,
    ...urlParameters: Params
  ): Observable<Model>;
}

/**
 * Api Class with only the ability to Read and Update models
 */
export abstract class ReadAndUpdateApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params>,
    ApiUpdate<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract update(
    model: PartialWith<Model, "id">,
    ...urlParameters: Params
  ): Observable<Model>;
}

/**
 * Api Class without the ability to destroy a model
 */
export abstract class NonDestructibleApi<
    Interface,
    ExtraFilters,
    Model extends AbstractModel,
    Params extends any[] = [],
    ModelFilters = Filters<Interface, ExtraFilters>
  >
  extends BawApiService<Model, Interface, ExtraFilters>
  implements
    ApiList<Model, Params>,
    ApiFilter<ModelFilters, Model, Params>,
    ApiShow<Model, Params>,
    ApiCreate<Model, Params>,
    ApiUpdate<Model, Params> {
  public abstract list(...urlParameters: Params): Observable<Model[]>;
  public abstract filter(
    filters: ModelFilters,
    ...urlParameters: Params
  ): Observable<Model[]>;
  public abstract show(
    model: IdOr<Model>,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract create(
    model: Model,
    ...urlParameters: Params
  ): Observable<Model>;
  public abstract update(
    model: PartialWith<Model, "id">,
    ...urlParameters: Params
  ): Observable<Model>;
}
