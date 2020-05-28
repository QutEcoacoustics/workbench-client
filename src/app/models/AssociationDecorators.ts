import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { ACCOUNT, ServiceToken } from "@baw-api/ServiceTokens";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { Observable, Subscription } from "rxjs";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";

/**
 * Creates an association between the ownerId and its user model
 */
export function Owner<M extends AbstractModel & { ownerId?: Id }>() {
  return HasOne<M>(ACCOUNT, "ownerId");
}

/**
 * Creates an association between the creatorId and its user model
 */
export function Creator<M extends AbstractModel & { creatorId?: Id }>() {
  return HasOne<M>(ACCOUNT, "creatorId");
}

/**
 * Creates an association between the updaterId and its user model
 */
export function Updater<M extends AbstractModel & { updaterId?: Id }>() {
  return HasOne<M>(ACCOUNT, "updaterId");
}

/**
 * Creates an association between the deleterId and its user model
 */
export function Deleter<M extends AbstractModel & { deleterId?: Id }>() {
  return HasOne<M>(ACCOUNT, "deleterId");
}

/**
 * Associate models with list of IDs
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to read IDs from
 * @param modelPrimaryKey Key to match ids against
 */
export function HasMany<M extends AbstractModel>(
  serviceToken: ServiceToken<ApiFilter<any, any[]>>,
  modelIdentifier: keyof M,
  modelPrimaryKey: keyof M = "id",
  ...modelParameters: ReadonlyArray<keyof M>
) {
  return createModelDecorator<M, ApiFilter<AbstractModel, any[]>>(
    serviceToken,
    modelIdentifier,
    modelParameters,
    (service, ids: Ids, ...params: any[]) =>
      service.filter(
        { filter: { [modelPrimaryKey]: { in: Array.from(ids) } } },
        ...params
      ),
    []
  );
}

/**
 * Associate model with ID
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to read ID from
 * @param ids Additional IDs
 */
export function HasOne<M extends AbstractModel>(
  serviceToken: ServiceToken<ApiShow<any, any[], IdOr<AbstractModel>>>,
  modelIdentifier: keyof M,
  ...modelParameters: ReadonlyArray<keyof M>
) {
  return createModelDecorator<
    M,
    ApiShow<AbstractModel, any[], IdOr<AbstractModel>>
  >(
    serviceToken,
    modelIdentifier,
    modelParameters,
    (service, id: Id, ...params: any[]) => service.show(id, ...params),
    new UnresolvedModel()
  );
}

/**
 * Insert a getter function into the model
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to extract IDs from
 * @param createRequest Create API Request
 */
function createModelDecorator<M extends AbstractModel, S>(
  serviceToken: ServiceToken<S>,
  modelIdentifier: keyof M,
  modelParameters: ReadonlyArray<keyof M>,
  createRequest: (
    service: S,
    id: Id | Ids,
    ...params: any[]
  ) => Observable<AbstractModel | AbstractModel[]>,
  unresolvedValue: any,
  failureValue: any = null
) {
  /**
   * Update cached model
   * @param target Target Model
   * @param key Cache Key
   * @param value Model
   */
  function updateCache(
    target: M,
    key: string,
    value: AbstractModel | AbstractModel[] | Subscription
  ) {
    if (value instanceof Array && target[key] instanceof Array) {
      target[key].push(...value);
    } else if (value instanceof Object && target[key] instanceof Object) {
      for (const property of Object.keys(value)) {
        target[key][property] = value[property];
      }
    } else {
      Object.defineProperty(target, key, {
        value,
        configurable: false,
      });
    }
  }

  /**
   * Get the associated model for a target model
   * @param target Target Model
   * @param associationKey Associated model key
   */
  function getAssociatedModel(
    target: M,
    associationKey: string
  ): null | AbstractModel | AbstractModel[] {
    // Check for any cached models
    const cachedModelKey = "_" + associationKey;
    if (target.hasOwnProperty(cachedModelKey)) {
      return target[cachedModelKey];
    }

    // Get Angular Injector Service
    const injector = target["injector"];
    if (!injector) {
      throw new Error(
        target.toString() +
          " does not have injector service. Tried to access " +
          associationKey
      );
    }

    // Get model identifying ID/s
    const identifier: Id | Ids = target[modelIdentifier] as any;
    if (identifier === undefined || identifier === null) {
      console.warn(target.toString() + " is missing identifier: ", {
        target,
        associationKey,
        identifier,
      });
      return failureValue;
    }

    // Get model parameters
    const parameters = modelParameters.map((param) => {
      const paramValue = target[param];
      if (paramValue === undefined || paramValue === null) {
        console.warn(target.toString() + " is missing parameter: ", {
          target,
          associationKey,
          param,
        });
      }
      return paramValue;
    });

    // Create service and request from API
    const service = injector.get(serviceToken.token);
    createRequest(service, identifier, parameters).subscribe(
      (model) => {
        console.log({ service, model });
        updateCache(target, cachedModelKey, model);
      },
      () => updateCache(target, cachedModelKey, failureValue)
    );

    // Save request to cache so other requests are ignored
    updateCache(target, cachedModelKey, unresolvedValue);
    return unresolvedValue;
  }

  return (target: M, associationKey: string) => {
    Object.defineProperty(target, associationKey, {
      get(this: M) {
        return getAssociatedModel(this, associationKey);
      },
    });
  };
}
