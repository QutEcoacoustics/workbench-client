import {
  ApiFilter,
  ApiShow,
  BawServiceImplementorOptions,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { ACCOUNT, ServiceToken } from "@baw-api/ServiceTokens";
import { KeysOfType } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  HasCreator,
  HasDeleter,
  HasUpdater,
  Id,
  Ids,
} from "@interfaces/apiInterfaces";
import { Observable, Subscription } from "rxjs";
import { Injector } from "@angular/core";
import {
  AbstractModel,
  AssociationInjector,
  UnresolvedModel,
} from "./AbstractModel";
import { User } from "./User";

/**
 * Creates an association between the creatorId and its user model
 */
export function creator<Parent extends AssociationInjector & HasCreator>() {
  const key: keyof Parent = "creatorId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Creates an association between the updaterId and its user model
 */
export function updater<Parent extends AssociationInjector & HasUpdater>() {
  const key: keyof Parent = "updaterId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Creates an association between the deleterId and its user model
 */
export function deleter<Parent extends AssociationInjector & HasDeleter>() {
  const key: keyof Parent = "deleterId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Abstract model parameter decorator which automates the process
 * of retrieving models linked by a group of ids in the parent model.
 *
 * @param serviceToken Injection token for API service used to retrieve the child models
 * @param identifierKeys Parent model key used to retrieve the list of ids for the child models
 * @param childIdentifier field used to filter child models by, typically `id`
 * @param routeParams Additional route params required for the filter request.
 * This is a list of keys from the parent where the values can be retrieved
 */
export function hasMany<
  Parent extends AssociationInjector,
  Child extends AbstractModel,
  Params extends any[] = []
>(
  serviceToken: ServiceToken<ApiFilter<Child, Params>>,
  identifierKeys?: KeysOfType<Parent, Id[] | Set<Id>>,
  childIdentifier: keyof Child = "id",
  routeParams: ReadonlyArray<keyof Parent> = []
) {
  /** Create filter to retrieve association models */
  const modelFilter = (parent: Parent) =>
    ({
      filter: {
        [childIdentifier]: { in: Array.from(parent[identifierKeys] as any) },
      },
    } as Filters<Child>);

  return createModelDecorator<Parent, Child, Params, ApiFilter<Child, Params>>(
    serviceToken,
    identifierKeys,
    routeParams,
    (service, parent: Parent, params: Params) =>
      service.filter(modelFilter(parent), ...params),
    UnresolvedModel.many,
    []
  );
}

/**
 * Abstract model parameter decorator which automates the process
 * of retrieving a single model linked by an id in the parent model
 *
 * @param serviceToken Injection token API service used to retrieve the child model
 * @param identifierKey Parent model key used to retrieve the id for the child model
 * @param routeParams Additional route params required for the filter request.
 * This is a list of keys from the parent where the values can be retrieved
 * @param failureValue Value to represent a failure to retrieve the model/s
 */
export function hasOne<
  Parent extends AssociationInjector,
  Child extends AbstractModel,
  Params extends any[] = []
>(
  serviceToken: ServiceToken<ApiShow<Child, Params>>,
  identifierKey: KeysOfType<Parent, Id>,
  routeParams: ReadonlyArray<keyof Parent> = [],
  failureValue: any = null
) {
  return createModelDecorator<Parent, Child, Params, ApiShow<Child, Params>>(
    serviceToken,
    identifierKey,
    routeParams,
    (service, parent: Parent, params: Params) =>
      service.show(parent[identifierKey] as any, ...params),
    UnresolvedModel.one,
    failureValue
  );
}

/**
 * Insert a getter function into the model
 *
 * @param serviceToken Injection token for API Service
 * @param identifierKey Parent model key used to retrieve the id/s for child model/s
 * @param routeParams Additional route params required for the filter request
 * @param apiRequest Callback function which creates the API request
 * @param unresolvedValue Value to return whilst output is unresolved
 * @param failureValue Value to represent a failure to retrieve the model/s
 */
function createModelDecorator<
  Parent extends AssociationInjector,
  Child extends AbstractModel,
  Params extends any[],
  Service
>(
  serviceToken: ServiceToken<Service>,
  identifierKey: keyof Parent,
  routeParams: ReadonlyArray<keyof Parent>,
  apiRequest: (
    service: Service,
    parent: Parent,
    params: Params
  ) => Observable<Child | Child[]>,
  unresolvedValue: Readonly<UnresolvedModel> | Readonly<UnresolvedModel[]>,
  failureValue: any
) {
  /**
   * Update the backing field which stores the last known value of the child model/s
   *
   * @param parent Parent model
   * @param backingFieldKey Private backing field key
   * @param child Child model/s or subscription to model/s
   */
  function updateBackingField(
    parent: Parent,
    backingFieldKey: string,
    child:
      | Child
      | Child[]
      | UnresolvedModel
      | Readonly<UnresolvedModel>
      | Readonly<UnresolvedModel[]>
      | Subscription
  ) {
    Object.defineProperty(parent, backingFieldKey, {
      value: child,
      configurable: true,
    });
  }

  /**
   * Get the associated model for a target model
   *
   * @param parent Parent model
   */
  function getAssociatedModel(
    parent: Parent
  ): Readonly<AbstractModel | AbstractModel[]> {
    // Check for any backing models
    const backingFieldKey = "_" + identifierKey.toString();
    if (Object.prototype.hasOwnProperty.call(parent, backingFieldKey)) {
      return parent[backingFieldKey];
    }

    // Get Angular Injector Service
    const injector: Injector = parent["injector"];
    if (!injector) {
      throw new Error(
        `${parent} does not have injector service. Tried to access ${identifierKey.toString()}`
      );
    }

    // Get child model identifying ID/s
    const identifier: Id | Ids = parent[identifierKey] as any;
    if (!isInstantiated(identifier) || (identifier as Set<any>)?.size === 0) {
      return failureValue;
    }

    // Map through model parameters and extract route parameter values
    const parameters: Params = routeParams.map((param) => {
      const paramValue = parent[param];
      if (!isInstantiated(paramValue)) {
        console.warn(`${parent} is missing parameter: `, {
          parent,
          identifierKey,
          param,
        });
      }
      return paramValue;
    }) as Params;

    const serviceInjector = serviceToken.service
      ? Injector.create({
          name: "AssociationInjector",
          parent: injector,
          providers: [
            { provide: serviceToken.token, useClass: serviceToken.service },
            { provide: BawApiService, useClass: BawApiService },
            {
              provide: BawServiceImplementorOptions,
              useValue: { disableNotification: true },
            },
          ],
        })
      : injector;

    const service = serviceInjector.get(serviceToken.token);

    // Set initial value for field
    updateBackingField(parent, backingFieldKey, unresolvedValue);

    // Load value from API (note: because of caching, this can be instant)
    apiRequest(service, parent, parameters).subscribe({
      next: (model) => updateBackingField(parent, backingFieldKey, model),
      error: (error) => {
        console.error(`${parent} failed to load ${identifierKey.toString()}.`, {
          target: parent,
          associationKey: identifierKey,
          identifier,
          error,
        });
        updateBackingField(parent, backingFieldKey, failureValue);
      },
    });

    return unresolvedValue;
  }

  return (target: Parent, associationKey: string) => {
    Object.defineProperty(target, associationKey, {
      get(this: Parent) {
        return getAssociatedModel(this);
      },
      configurable: true,
    });
  };
}
