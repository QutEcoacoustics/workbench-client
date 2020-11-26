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

/**
 * Modify a base filter to add a foreign key condition
 *
 * @param filters Base Filters
 * @param key Foreign key
 * @param model Foreign key value (if undefined, returns base filters)
 */
export function filterByForeignKey<T>(
  filters: Filters<T>,
  key: keyof T,
  model: AbstractModel | string | number
): Filters<T> {
  const { filter, ...meta } = filters;

  // Only return if model is undefined, not null (which is a valid input)
  if (model === undefined) {
    return filters;
  }

  return {
    ...meta,
    filter: {
      ...filter,
      [key]: {
        eq: model instanceof AbstractModel ? model.id : model,
      },
    },
  };
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
export interface ApiList<M, P extends any[] = []> {
  /**
   * Get list of models
   *
   * @param args URL parameter values
   */
  list(...urlParameters: P): Observable<M[]>;
}

/**
 * API Filter functionality
 */
export interface ApiFilter<M extends AbstractModel, P extends any[] = []> {
  /**
   * Get list of models, but filtered using the filter API
   *
   * @param args URL parameter values
   */
  filter(filters: Filters<M>, ...urlParameters: P): Observable<M[]>;
}

/**
 * API Show functionality
 */
export interface ApiShow<
  M extends AbstractModel,
  P extends any[] = [],
  I extends IdOr<M> = IdOr<M>
> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  show(model: M | I, ...urlParameters: P): Observable<M>;
}

/**
 * API Create functionality
 */
export interface ApiCreate<M extends AbstractModel, P extends any[] = []> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  create(model: M, ...urlParameters: P): Observable<M>;
}

/**
 * API Update functionality
 */
export interface ApiUpdate<M extends AbstractModel, P extends any[] = []> {
  /**
   * Get individual model
   *
   * @param args URL parameter values
   */
  update(model: PartialWith<M, "id">, ...urlParameters: P): Observable<M>;
}
/**
 * API Delete functionality
 */
export interface ApiDestroy<
  M extends AbstractModel,
  P extends any[] = [],
  I extends IdOr<M> = IdOr<M>
> {
  /**
   * destroy  individual model
   *
   * @param args URL parameter values
   */
  destroy(model: I, ...urlParameters: P): Observable<M | void>;
}

/**
 * Api Class with all abilities enabled
 */
export abstract class StandardApi<M extends AbstractModel, P extends any[] = []>
  extends BawApiService<M>
  implements
    ApiList<M, P>,
    ApiFilter<M, P>,
    ApiShow<M, P>,
    ApiCreate<M, P>,
    ApiUpdate<M, P>,
    ApiDestroy<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  public abstract create(model: M, ...urlParameters: P): Observable<M>;
  public abstract update(
    model: PartialWith<M, "id">,
    ...urlParameters: P
  ): Observable<M>;
  public abstract destroy(
    model: IdOr<M>,
    ...urlParameters: P
  ): Observable<M | void>;
}

/**
 * Api Class without the ability to update a model
 */
export abstract class ImmutableApi<
    M extends AbstractModel,
    P extends any[] = []
  >
  extends BawApiService<M>
  implements
    ApiList<M, P>,
    ApiFilter<M, P>,
    ApiShow<M, P>,
    ApiCreate<M, P>,
    ApiDestroy<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  public abstract create(model: M, ...urlParameters: P): Observable<M>;
  public abstract destroy(
    model: IdOr<M>,
    ...urlParameters: P
  ): Observable<M | void>;
}

/**
 * Api Class with only readable abilities enabled
 */
export abstract class ReadonlyApi<M extends AbstractModel, P extends any[] = []>
  extends BawApiService<M>
  implements ApiList<M, P>, ApiFilter<M, P>, ApiShow<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
}

/**
 * Api Class with only the ability to Read and Create models
 */
export abstract class ReadAndCreateApi<
    M extends AbstractModel,
    P extends any[] = []
  >
  extends BawApiService<M>
  implements ApiList<M, P>, ApiFilter<M, P>, ApiShow<M, P>, ApiCreate<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  public abstract create(model: M, ...urlParameters: P): Observable<M>;
}

/**
 * Api Class with only the ability to Read and Update models
 */
export abstract class ReadAndUpdateApi<
    M extends AbstractModel,
    P extends any[] = []
  >
  extends BawApiService<M>
  implements ApiList<M, P>, ApiFilter<M, P>, ApiShow<M, P>, ApiUpdate<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  public abstract update(
    model: PartialWith<M, "id">,
    ...urlParameters: P
  ): Observable<M>;
}

/**
 * Api Class without the ability to destroy a model
 */
export abstract class NonDestructibleApi<
    M extends AbstractModel,
    P extends any[] = []
  >
  extends BawApiService<M>
  implements
    ApiList<M, P>,
    ApiFilter<M, P>,
    ApiShow<M, P>,
    ApiCreate<M, P>,
    ApiUpdate<M, P> {
  public abstract list(...urlParameters: P): Observable<M[]>;
  public abstract filter(
    filters: Filters<M>,
    ...urlParameters: P
  ): Observable<M[]>;
  public abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  public abstract create(model: M, ...urlParameters: P): Observable<M>;
  public abstract update(
    model: PartialWith<M, "id">,
    ...urlParameters: P
  ): Observable<M>;
}
