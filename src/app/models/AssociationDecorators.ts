import { ApiFilter, ApiShow } from "@baw-api/api-common";
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
import { Observable, Subscription, zip } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { User } from "./User";
import {
  AssociationInjector,
  ImplementsAssociations,
} from "./ImplementsInjector";

/**
 * Creates an association between the creatorId and its user model
 */
export function creator<Parent extends ImplementsAssociations & HasCreator>() {
  const key: keyof Parent = "creatorId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Creates an association between the updaterId and its user model
 */
export function updater<Parent extends ImplementsAssociations & HasUpdater>() {
  const key: keyof Parent = "updaterId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Creates an association between the deleterId and its user model
 */
export function deleter<Parent extends ImplementsAssociations & HasDeleter>() {
  const key: keyof Parent = "deleterId";
  return hasOne<Parent, User>(ACCOUNT, key as any);
}

/**
 * Abstract model parameter decorator which automates the process
 * of retrieving models request linked by a group of ids in the parent model.
 *
 * @param serviceToken Injection token for API service used to retrieve the child models
 * @param identifierKeys Parent model key used to retrieve the list of ids for the child models
 * @param routeParams Additional route params required for the filter request.
 * This is a list of keys from the parent where the values can be retrieved
 *
 * @deprecated
 * Prefer to use `hasMany` instead as it provides improved performance through
 * debouncing and improved caching of requests.
 *
 * ?You may have to use this decorator for request that do not support `show`
 * ?requests
 */
export function hasManyFilter<
  Parent extends ImplementsAssociations,
  Child extends AbstractModel,
  Params extends any[] = []
>(
  serviceToken: ServiceToken<ApiFilter<Child, Params>>,
  identifierKeys?: KeysOfType<Parent, Id[] | Set<Id>>,
  routeParams: ReadonlyArray<keyof Parent> = []
) {
  /** Create filter to retrieve association models */
  const modelFilter = (parent: Parent) =>
    ({
      filter: {
        id: { in: Array.from(parent[identifierKeys] as any) },
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
 * of retrieving models linked by a group of ids in the parent model.
 *
 * @param serviceToken Injection token for API service used to retrieve the child models
 * @param identifierKeys Parent model key used to retrieve the list of ids for the child models
 * @param routeParams Additional route params required for the show request.
 * This is a list of keys from the parent where the values can be retrieved
 */
export function hasMany<
  Parent extends ImplementsAssociations,
  Child extends AbstractModel,
  Params extends any[] = []
>(
  serviceToken: ServiceToken<ApiShow<Child, Params>>,
  identifierKeys?: KeysOfType<Parent, Id[] | Set<Id>>,
  routeParams: ReadonlyArray<keyof Parent> = []
) {
  // we use multiple show (GET) requests in the hasMany associations so when
  // multiple models have the same associated models in a hasMany relationship
  // they can get debounced and the same model can be shared between the
  // different models
  //
  // e.g. projects can have multiple owners, but one updater/creator
  // it is likely that one of the owners is the updater/creator, so the http
  // debouncing interceptor should be able to combine the requests and prevent
  // requesting the same user model twice (once for the creator, and once for
  // owner/updater)
  const modelRequester = (
    service: ApiShow<Child, Params>,
    parentModel: Parent,
    params: Params
  ): Observable<Child[]> => {
    const associatedModelIds = Array.from(parentModel[identifierKeys] as any);
    // Use zip to combine multiple observables into a single observable that emits an array
    return zip<Child[]>(
      associatedModelIds.map((model: Id) => service.show(model, ...params))
    );
  };

  return createModelDecorator<Parent, Child, Params, ApiShow<Child, Params>>(
    serviceToken,
    identifierKeys,
    routeParams,
    modelRequester,
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
  Parent extends ImplementsAssociations,
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
  Parent extends ImplementsAssociations,
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
   * To prevent making duplicate API calls for an association when the value has
   * not changed, the backing field can be returned if the identifier value has
   * not changed since the last API call.
   *
   * This variable stores the last known identifier value so that we can compare
   * it against the current identifier value in the parent model.
   */
  const storedIdentifierKey = Symbol("storedIdentifier_" + identifierKey.toString());
  const backingFieldKey = "_" + identifierKey.toString();

  /**
   * Update the backing field which stores the last known value of the child model/s
   *
   * @param parent Parent model
   * @param backingFieldKey Private backing field key
   * @param child Child model/s or subscription to model/s
   */
  function updateBackingField(
    parent: Parent,
    child:
      | Child
      | Child[]
      | UnresolvedModel
      | Readonly<UnresolvedModel>
      | Readonly<UnresolvedModel[]>
      | Subscription
  ) {
    // We use Object.defineProperty so that the property is not enumerable
    // and does not show up in JSON.stringify calls.
    Object.defineProperty(parent, storedIdentifierKey, {
      value: JSON.stringify(parent[identifierKey]),
      configurable: true,
    });

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
    if (
      Object.prototype.hasOwnProperty.call(parent, backingFieldKey) &&

      // We check the storedIdentifierValue so that if the identifier value
      // changes in the parent model, we don't return a stale backing value
      // from a previous identifier value.
      //
      // We use Object.is instead of === so that if there is a bug in the client
      // that causes an identifier value to end up as NaN, this condition still
      // passes, and we don't end up making a potentially infinite number of API
      // calls.
      // Note: I have never seen this happen in practice, but I handle this case
      // as a defensive programming measure so that the client does not end up
      // flooding the API because of a bug in the client code.
      // Object.is(parent[storedIdentifierKey], parent[identifierKey])
      //
      // TODO: Remove this JSON.stringify hack that was used to get pages like
      // the statistics page working that eagerly destroy and recreate models.
      parent[storedIdentifierKey] === JSON.stringify(parent[identifierKey])
    ) {
      return parent[backingFieldKey];
    }

    // the injector should be an AssociationInjector that was provided by the
    // baw-api.service
    // we use a different injector for associations so that the the we can
    // inject the correct options for the baw-api service without affecting
    // the options for the rest of the application
    const injector: AssociationInjector = parent["injector"];
    if (!injector) {
      throw new Error(
        `${parent} does not have injector service. Tried to access ${identifierKey.toString()}`
      );
    } else if (typeof injector.get !== "function") {
      throw new Error(
        `Injector service on ${parent} is not a valid injector. Found '${typeof injector.get}'. Value: '${injector.get}'. Injector value: '${injector}' Tried to access ${identifierKey.toString()}`
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

    // Create service and request from API
    const service = injector.get?.(serviceToken.token);

    // Set initial value for field
    updateBackingField(parent, unresolvedValue);

    // Load value from API (note: because of caching, this can be instant)
    apiRequest(service, parent, parameters).subscribe({
      next: (model) => updateBackingField(parent, model),
      error: (error) => {
        console.error(`${parent} failed to load ${identifierKey.toString()}.`, {
          target: parent,
          associationKey: identifierKey,
          identifier,
          error,
        });
        updateBackingField(parent, failureValue);
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
