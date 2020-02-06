import { Observable } from "rxjs";
import { Param } from "src/app/interfaces/apiInterfaces";
import { AbstractInterface, AbstractModel } from "src/app/models/AbstractModel";
import { BawApiService, Filters } from "./base-api.service";

export type IdOr<T extends AbstractModel> = T | number;
export type IdParam<T extends AbstractModel> = (_: IdOr<T>) => string;
export type IdParamOptional<T extends AbstractModel> = (
  _: IdOr<T> | Empty
) => string;
export function modelId<T extends AbstractModel>(x: IdOr<T> | Empty) {
  if (x === Empty) {
    return Empty;
  }

  return (x instanceof AbstractModel ? x.id : x).toString();
}
export function param(x: Param) {
  return x;
}
export function option(x?: "new" | "filter" | "") {
  return x ? x : "";
}
export type Empty = "";
export const Empty = "";
export const New = "new";
export const Filter = "filter";

export interface ApiList<M, P extends any[]> {
  list(...urlParameters: P): Observable<M[]>;
}

/**
 * API Filter functionality
 */
export interface ApiFilter<M extends AbstractModel, P extends any[]> {
  filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
}

/**
 * API Show functionality
 */
export interface ApiShow<
  M extends AbstractModel,
  P extends any[],
  I extends IdOr<M>
> {
  show(model: M | I, ...urlParameters: P): Observable<M>;
}

/**
 * API Create functionality
 */
export interface ApiCreate<
  M extends AbstractModel,
  D extends AbstractInterface,
  P extends any[]
> {
  create(model: D, ...urlParameters: P): Observable<M>;
}

/**
 * API Update functionality
 */
export interface ApiUpdate<
  M extends AbstractModel,
  D extends AbstractInterface,
  P extends any[],
  I extends IdOr<M>
> {
  update(id: M | I, model: D, ...urlParameters: P): Observable<M>;
}
/**
 * API Delete functionality
 */
export interface ApiDestroy<
  M extends AbstractModel,
  P extends any[],
  I extends IdOr<M>
> {
  destroy(model: I, ...urlParameters: P): Observable<null>;
}

/**
 * Api Class with all abilities enabled
 */
export abstract class StandardApi<
  M extends AbstractModel,
  D extends AbstractInterface,
  P extends any[]
> extends BawApiService<M>
  implements
    ApiList<M, P>,
    ApiFilter<M, P>,
    ApiShow<M, P, IdOr<M>>,
    ApiCreate<M, D, P>,
    ApiUpdate<M, D, P, IdOr<M>>,
    ApiDestroy<M, P, IdOr<M>> {
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  abstract create(model: D, ...urlParameters: P): Observable<M>;
  abstract update(id: IdOr<M>, model: D, ...urlParameters: P): Observable<M>;
  abstract destroy(model: IdOr<M>, ...urlParameters: P): Observable<null>;
}

export abstract class ReadonlyApi<M extends AbstractModel, P extends any[]>
  extends BawApiService<M>
  implements ApiList<M, P>, ApiFilter<M, P>, ApiShow<M, P, IdOr<M>> {
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
}
