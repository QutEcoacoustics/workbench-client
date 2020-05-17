import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { ACCOUNT, ServiceToken } from "@baw-api/ServiceTokens";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AbstractModel } from "./AbstractModel";

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
    (service, id: Id, ...params: any[]) => service.show(id, ...params)
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
    value: Observable<AbstractModel | AbstractModel[]>
  ) {
    Object.defineProperty(target, key, {
      value,
      configurable: false,
    });
  }

  /**
   * Get the associated model for a target model
   * @param target Target Model
   * @param associationKey Associated model key
   */
  function getAssociatedModel(
    target: M,
    associationKey: string
  ): Observable<null | AbstractModel | AbstractModel[]> {
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
      return of(failureValue);
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
    const request = createRequest(service, identifier, parameters).pipe(
      map((response) => {
        // Change cached value to BehaviorSubject so that it will instantly return
        updateCache(target, cachedModelKey, new BehaviorSubject(response));
        return response;
      })
    );

    // Save request to cache so other requests are ignored
    updateCache(target, cachedModelKey, request);
    return request;
  }

  return (target: M, associationKey: string) => {
    Object.defineProperty(target, associationKey, {
      get(this: M) {
        return getAssociatedModel(this, associationKey);
      },
    });
  };
}
