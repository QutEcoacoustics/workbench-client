import { InjectionToken, Injector } from "@angular/core";
import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Id, Ids } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModel {
  constructor(raw: object, private injector?: Injector) {
    this[AbstractModel.associationsKey] = {};
    return Object.assign(this, raw);
  }

  /**
   * Hidden meta symbol
   */
  private static metaKey = Symbol("meta");

  /**
   * Hidden associations key
   */
  private static associationsKey = Symbol("associations");

  /**
   * Model ID
   */
  public readonly id?: Id;

  /**
   * Model Identifier
   */
  public readonly kind: string;

  /**
   * Redirect path to view model on website. This is a string which can be
   * used by `Router.navigateByUrl()` without any processing. For example,
   * for the project abstract model, this path should direct to the project page.
   */
  public abstract get viewUrl(): string;

  /**
   * Redirect path to view model on website. This is a string which can be
   * used by `Router.navigateByUrl()` without any processing. For example,
   * for the project abstract model, this path should direct to the project page.
   * @param args Url arguments
   */
  public getViewUrl(...args: any[]): string {
    return this.viewUrl;
  }

  /**
   * Convert model to JSON
   */
  public abstract toJSON(): object;

  /**
   * Add hidden metadata to model
   * @param meta Metadata
   */
  public addMetadata(meta: Meta) {
    this[AbstractModel.metaKey] = meta;
  }

  /**
   * Get hidden model metadata
   */
  public getMetadata(): Meta {
    return this[AbstractModel.metaKey];
  }

  /**
   * Add property to object if it exists (not undefined/null)
   * @param object Output object
   * @param key Key name
   * @param value Key value
   */
  protected addIfExists(object: any, key: string, value: any) {
    if (value) {
      object[key] = value;
    }
  }
}

/**
 * Property has many associations
 * @param serviceToken Injection token for API Service
 * @param key Key to match ids against
 */
export function HasMany<M extends AbstractModel, T extends ApiFilter<M, any>>(
  serviceToken: InjectionToken<any>,
  key: string = "id"
) {
  return function (target: AbstractModel, field: string) {
    // Extract association name (ie. siteIds => sites)
    const association = field.replace("Ids", "s");

    createGetter<M, T>(
      serviceToken,
      target,
      association,
      field,
      (service, ids: Ids) => service.filter({ filter: { [key]: { in: ids } } })
    );
  };
}

export function HasOne<
  M extends AbstractModel,
  T extends ApiShow<M, any, IdOr<M>>
>(serviceToken: InjectionToken<any>, ids: string[] = []) {
  return function (target: AbstractModel, field: string) {
    // Extract association name (ie. siteId => site)
    const association = field.replace("Id", "");

    createGetter<M, T>(
      serviceToken,
      target,
      association,
      field,
      (service, id: Id) => service.show(id, ...ids)
    );
  };
}

function createGetter<M extends AbstractModel, T>(
  serviceToken: InjectionToken<any>,
  target: AbstractModel,
  association: string,
  field: string,
  createService: (
    service: T,
    fieldData: Id | Ids
  ) => Observable<AbstractModel | AbstractModel[]>
) {
  Object.defineProperty(target, association, {
    get(this: AbstractModel) {
      // If model has no injector, error out
      if (!this["injector"]) {
        throw new Error("Model does not have injector service.");
      }

      // If field is undefined, return
      if (this[field] === undefined || this[field] === null) {
        return of(null);
      }

      // If result cached, return
      if (this[AbstractModel["associationsKey"]][association]) {
        return of(this[AbstractModel["associationsKey"]][association]);
      }

      // Create service and request from API
      const service = this["injector"].get<T>(serviceToken);
      return createService(service, this[field]).pipe(
        map((model: M | M[]) => {
          // Save to cache and return models
          this[AbstractModel["associationsKey"]][association] = model;
          return model;
        })
      );
    },
  });
}
