import { InjectionToken, Injector } from "@angular/core";
import { SHALLOW_SITE, USER } from "@baw-api/ServiceTokens";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Id, Ids } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";
import type { ShallowSitesService } from "@baw-api/sites.service";
import type { AccountService } from "@baw-api/account.service";
import { ApiShow, IdOr, ApiFilter } from "@baw-api/api-common";

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModel {
  constructor(raw: object, private injector?: Injector) {
    return Object.assign(this, raw);
  }

  /**
   * Hidden meta symbol
   */
  private static metaKey = Symbol("meta");

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
 * Associate models with list of IDs
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Parameter to read IDs from
 * @param modelPrimaryKey Key to match ids against
 */
export function HasMany(
  serviceToken: InjectionToken<ApiFilter<AbstractModel, any[]>>,
  modelIdentifier: (model: AbstractModel) => Ids,
  modelPrimaryKey: string = "id"
) {
  return function (model: AbstractModel, associationKey: string) {
    createGetter<ApiFilter<AbstractModel, any[]>>(
      serviceToken,
      model,
      associationKey,
      modelIdentifier,
      (service, ids: Ids) =>
        service.filter({ filter: { [modelPrimaryKey]: { in: ids } } })
    );
  };
}

/**
 * Associate model with ID
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Parameter to read ID from
 * @param ids Additional IDs
 */
export function HasOne(
  serviceToken: InjectionToken<
    ApiShow<AbstractModel, any[], IdOr<AbstractModel>>
  >,
  modelIdentifier: (model: AbstractModel) => Id,
  ids: string[] = []
) {
  return function (model: AbstractModel, associationKey: string) {
    createGetter<ApiShow<AbstractModel, any[], IdOr<AbstractModel>>>(
      serviceToken,
      model,
      associationKey,
      modelIdentifier,
      (service, id: Id) => service.show(id, ...ids)
    );
  };
}

/**
 * Insert a getter function into the model
 * @param serviceToken Injection token for API Service
 * @param target Target model
 * @param associationKey Key to identify associated model
 * @param params Property to extract IDs from
 * @param createRequest Create API Request
 */
function createGetter<S>(
  serviceToken: InjectionToken<S>,
  target: AbstractModel,
  associationKey: string,
  modelIdentifier: (model: AbstractModel) => Id | Ids,
  createRequest: (
    service: S,
    params: Id | Ids
  ) => Observable<AbstractModel | AbstractModel[]>
) {
  Object.defineProperty(target, associationKey, {
    get(this: AbstractModel) {
      // If model has no injector, error out
      const injector = this["injector"];
      if (!injector) {
        throw new Error("Model does not have injector service.");
      }

      // If field is undefined, return
      const identifier = modelIdentifier(this);
      if (identifier === undefined || identifier === null) {
        return of(null);
      }

      // If result cached, return
      const cachedModel = `_${associationKey}`;
      if (this[cachedModel]) {
        return of(this[cachedModel]);
      }

      // Create service and request from API
      const service = injector.get(serviceToken);
      return createRequest(service, identifier).pipe(
        map((model) => {
          // Cache model and return
          Object.defineProperty(target, cachedModel, {
            value: model,
            configurable: false,
          });

          return model;
        })
      );
    },
  });
}
