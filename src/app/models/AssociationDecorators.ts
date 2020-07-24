import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { ACCOUNT, ServiceToken } from "@baw-api/ServiceTokens";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { Observable, Subscription } from "rxjs";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";

/**
 * Creates an association between the ownerId and its user model
 * TODO Modify to handle ghost users
 */
export function Owner<M extends AbstractModel & { ownerId?: Id }>() {
  return HasOne<M>(ACCOUNT, "ownerId");
}

/**
 * Creates an association between the creatorId and its user model
 * TODO Modify to handle ghost users
 */
export function Creator<M extends AbstractModel & { creatorId?: Id }>() {
  return HasOne<M>(ACCOUNT, "creatorId");
}

/**
 * Creates an association between the updaterId and its user model
 * TODO Modify to handle ghost users
 */
export function Updater<M extends AbstractModel & { updaterId?: Id }>() {
  return HasOne<M>(ACCOUNT, "updaterId");
}

/**
 * Creates an association between the deleterId and its user model
 * TODO Modify to handle ghost users
 */
export function Deleter<M extends AbstractModel & { deleterId?: Id }>() {
  return HasOne<M>(ACCOUNT, "deleterId");
}

/**
 * Associate models with list of IDs
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to read IDs from
 * @param modelPrimaryKey Keys to match additional ids against
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
    UnresolvedModel.many,
    []
  );
}

/**
 * Associate model with ID
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to read ID from
 * @param modelParameters Keys to match additional ids against
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
    UnresolvedModel.one,
    null
  );
}

/**
 * Insert a getter function into the model
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to extract IDs from
 * @param modelParameters Additional IDs/parameters for filter request
 * @param createRequest Create API Request
 * @param unresolvedValue Value to return whilst output is unresolved
 * @param failureValue Value to represent a failure to retrieve the model/s
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
  failureValue: any
) {
  /**
   * Update backing model
   * @param target Target Model
   * @param backingFieldKey Backing Field Key
   * @param value Model
   */
  function updateBackingField(
    target: M,
    backingFieldKey: string,
    value: AbstractModel | AbstractModel[] | Subscription
  ) {
    if (target[backingFieldKey] instanceof Array && value instanceof Array) {
      value = target[backingFieldKey].concat(value);
    }

    Object.defineProperty(target, backingFieldKey, {
      value,
      configurable: true,
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
  ): null | AbstractModel | AbstractModel[] {
    // Check for any backing models
    const backingFieldKey = "_" + associationKey;
    if (target.hasOwnProperty(backingFieldKey)) {
      return target[backingFieldKey];
    }

    // Get Angular Injector Service
    const injector = target["injector"];
    if (!injector) {
      throw new Error(
        `${target} does not have injector service. Tried to access ${associationKey}`
      );
    }

    // Get model identifying ID/s
    const identifier: Id | Ids = target[modelIdentifier] as any;
    if (!isInstantiated(identifier)) {
      console.warn(`${target} is missing identifier: `, {
        target,
        associationKey,
        identifier,
      });
      return failureValue;
    }

    // Map through model parameters and extract values
    const parameters = modelParameters.map((param) => {
      const paramValue = target[param];
      if (!isInstantiated(paramValue)) {
        console.warn(`${target} is missing parameter: `, {
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
      (model) => updateBackingField(target, backingFieldKey, model),
      (error) => {
        console.error(`${target} failed to load ${associationKey}.`, {
          target,
          associationKey,
          identifier,
          error,
        });
        updateBackingField(target, backingFieldKey, failureValue);
      }
    );

    // Save request to cache so other requests are ignored
    updateBackingField(target, backingFieldKey, unresolvedValue);
    return unresolvedValue;
  }

  return (target: M, associationKey: string) => {
    Object.defineProperty(target, associationKey, {
      get(this: M) {
        return getAssociatedModel(this, associationKey);
      },
      configurable: true,
    });
  };
}
