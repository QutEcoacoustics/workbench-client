import { Observable } from "rxjs";
import { PartialWith } from "src/app/helpers/advancedTypes";
import { Param } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { BawApiService, Filters } from "./base-api.service";

export type IdOr<T extends AbstractModel> = T | number;
export type IdParam<T extends AbstractModel> = (_: IdOr<T>) => string;
export type IdParamOptional<T extends AbstractModel> = (_: IdOr<T> | Empty) => string;
export function id<T extends AbstractModel>(x: IdOr<T> | Empty) {
  if (x === Empty) {
    return Empty;
  }

  return (x instanceof AbstractModel ? x.id : x).toString();
}
export function param(x: Param) { return x; }
export function option(x?: "new" | "filter" | "") {
  if (x === "new") {
    return "/new";
  } else if (x === "filter") {
    return "/filter";
  } else {
    return "";
  }
}
export type Empty = "";
export const Empty = "";
export const New = "new";
export const Filter = "filter";

export interface ApiList<M, P extends any[]> {
  /**
   * Get list of models
   * @param args URL parameter values
   */
  list(...urlParameters: P): Observable<M[]>;
}

/**
 * API Filter functionality
 */
export interface ApiFilter<M extends AbstractModel, P extends any[]> {
  /**
   * Get list of models, but filtered using the filter API
   * @param args URL parameter values
   */
  filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
}

/**
 * API Show functionality
 */
export interface ApiShow<M extends AbstractModel, P extends any[], I extends IdOr<M>> {
  /**
   * Get individual model
   * @param args URL parameter values
   */
  show(model: M | I, ...urlParameters: P): Observable<M>;
}

/**
 * API Create functionality
 */
export interface ApiCreate<M extends AbstractModel, P extends any[]> {
  /**
   * Get individual model
   * @param args URL parameter values
   */
  create(model: M, ...urlParameters: P): Observable<M>;
}

/**
 * API Update functionality
 */
export interface ApiUpdate<M extends AbstractModel, P extends any[]> {
  /**
   * Get individual model
   * @param args URL parameter values
   */
  update(model: PartialWith<M, "id">, ...urlParameters: P): Observable<M>;
}
/**
 * API Delete functionality
 */
export interface ApiDestroy<M extends AbstractModel, P extends any[], I extends IdOr<M>> {
  /**
   * destroy  individual model
   * @param args URL parameter values
   */
  destroy(model: I, ...urlParameters: P): Observable<M>;
}

/**
 * Api Class with all abilities enabled
 */
export abstract class StandardApi<
  M extends AbstractModel,
  P extends any[]> extends BawApiService<M> implements
  ApiList<M, P>,
  ApiFilter<M, P>,
  ApiShow<M, P, IdOr<M>>,
  ApiCreate<M, P>,
  ApiUpdate<M, P>,
  ApiDestroy<M, P, IdOr<M>> {
  abstract list(...urlParameters: P): Observable<M[]>;
  abstract filter(filters: Filters, ...urlParameters: P): Observable<M[]>;
  abstract show(model: IdOr<M>, ...urlParameters: P): Observable<M>;
  abstract create(model: M, ...urlParameters: P): Observable<M>;
  abstract update(model: PartialWith<M, "id">, ...urlParameters: P): Observable<M>;
  abstract destroy(model: IdOr<M>, ...urlParameters: P): Observable<M>;
}
