import { PartialWith } from "@helpers/advancedTypes";
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
  if (x === Empty) {
    return x;
  } else if (x instanceof AbstractModel) {
    return x.id.toString();
  } else {
    return x.toString();
  }
}

/**
 * Create parameter (used by stringTemplate)
 * @param x Api parameter
 */
export function param(x: Param) {
  return x;
}

/**
 * Create option (used by stringTemplate)
 * @param x Api option
 */
export function option(x?: New | Filter | Empty) {
  return x ? x : Empty;
}

export type Empty = "";
export type New = "new";
export type Filter = "filter";
export const Empty: Empty = "";
export const New: New = "new";
export const Filter: Filter = "filter";

/**
 * API List functionality
 */
export interface ApiList<M, P extends any[] = []> {
  /**
   * Get list of models
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
   * @param args URL parameter values
   */
  filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
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
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  abstract create(model: M, ...urlParameters: P): Observable<M>;
  abstract update(
    model: PartialWith<M, "id">,
    ...urlParameters: P
  ): Observable<M>;
  abstract destroy(model: IdOr<M>, ...urlParameters: P): Observable<M | void>;
}

/**
 * Api Class without the ability to update a model
 */
export abstract class ImmutableApi<
  M extends AbstractModel,
  P extends any[] = []
> extends BawApiService<M>
  implements
    ApiList<M, P>,
    ApiFilter<M, P>,
    ApiShow<M, P>,
    ApiCreate<M, P>,
    ApiDestroy<M, P> {
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  abstract create(model: M, ...urlParameters: P): Observable<M>;
  abstract destroy(model: IdOr<M>, ...urlParameters: P): Observable<M | void>;
}

/**
 * Api Class with only readable abilities enabled
 */
export abstract class ReadonlyApi<M extends AbstractModel, P extends any[] = []>
  extends BawApiService<M>
  implements ApiList<M, P>, ApiFilter<M, P>, ApiShow<M, P> {
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
}
