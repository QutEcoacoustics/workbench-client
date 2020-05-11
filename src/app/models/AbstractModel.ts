import { Injector, Optional } from "@angular/core";
import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { ACCOUNT, ServiceToken } from "@baw-api/ServiceTokens";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Id, Ids } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModel {
  constructor(raw: object, @Optional() private injector?: Injector) {
    return Object.assign(this, raw);
  }

  /**
   * Hidden meta symbol
   */
  private static metaKey = Symbol("meta");

  /**
   * Hidden attributes symbol.
   * This stores the list of model attributes which are used to
   * generate the toJSON() output.
   */
  public static attributeKey = Symbol("meta");

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
  public toJSON() {
    const output = {};
    this[AbstractModel.attributeKey].forEach((attribute) => {
      const value = this[attribute];
      if (value instanceof Set) {
        output[attribute] = Array.from(value);
      } else if (value instanceof DateTime) {
        output[attribute] = value.toISO();
      } else if (value instanceof Duration) {
        output[attribute] = value.as("seconds");
      } else {
        output[attribute] = this[attribute];
      }
    });
    return output;
  }

  /**
   * Convert model to string.
   * @param value Display custom value
   */
  public toString(value?: string): string {
    if (!value && this["name"]) {
      value = this["name"];
    }
    const identifier = value ? `${value} (${this.id})` : this.id.toString();
    return `${this.kind}: ${identifier}`;
  }

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
}

/**
 * Creates an association between the ownerId and its user model
 */
export function Owner<M extends AbstractModel & { ownerId?: Id }>() {
  return HasOne(ACCOUNT, (m: M) => m.ownerId);
}

/**
 * Creates an association between the creatorId and its user model
 */
export function Creator<M extends AbstractModel & { creatorId?: Id }>() {
  return HasOne(ACCOUNT, (m: M) => m.creatorId);
}

/**
 * Creates an association between the updaterId and its user model
 */
export function Updater<M extends AbstractModel & { updaterId?: Id }>() {
  return HasOne(ACCOUNT, (m: M) => m.updaterId);
}

/**
 * Creates an association between the deleterId and its user model
 */
export function Deleter<M extends AbstractModel & { deleterId?: Id }>() {
  return HasOne(ACCOUNT, (m: M) => m.deleterId);
}

/**
 * Associate models with list of IDs
 * @param serviceToken Injection token for API Service
 * @param modelIdentifier Property to read IDs from
 * @param modelPrimaryKey Key to match ids against
 */
export function HasMany(
  serviceToken: ServiceToken<ApiFilter<AbstractModel, any[]>>,
  modelIdentifier: (target: AbstractModel) => Ids,
  modelPrimaryKey: string = "id",
  ...modelParameters: ((target: AbstractModel) => Id)[]
) {
  return createModelDecorator<ApiFilter<AbstractModel, any[]>>(
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
export function HasOne(
  serviceToken: ServiceToken<
    ApiShow<AbstractModel, any[], IdOr<AbstractModel>>
  >,
  modelIdentifier: (target: AbstractModel) => Id,
  ...modelParameters: ((target: AbstractModel) => Id)[]
) {
  return createModelDecorator<
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
function createModelDecorator<S>(
  serviceToken: ServiceToken<S>,
  modelIdentifier: (target: AbstractModel) => Id | Ids,
  modelParameters: ((target: AbstractModel) => Id)[],
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
    target: AbstractModel,
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
    target: AbstractModel,
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
    const identifier = modelIdentifier(target);
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
      const paramValue = param(target);
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

  return (target: AbstractModel, associationKey: string) => {
    Object.defineProperty(target, associationKey, {
      get(this: AbstractModel) {
        return getAssociatedModel(this, associationKey);
      },
    });
  };
}

/**
 * Add key to the models attributes
 */
export function BawPersistAttr(model: AbstractModel, key: string) {
  if (!model[AbstractModel.attributeKey]) {
    model[AbstractModel.attributeKey] = [];
  }

  model[AbstractModel.attributeKey].push(key);
}

/**
 * Convert a collection of ids into a set
 */
export const BawCollection = createDecorator((model, key, ids: Id[] | Ids) => {
  if (ids instanceof Set) {
    return;
  }

  model[key] = new Set(ids || []);
});

/**
 * Convert timestamp string into DateTimeTimezone
 */
export const BawDateTime = createDecorator(
  (model, key, timestamp: string | DateTime) => {
    if (timestamp instanceof DateTime) {
      return;
    }

    model[key] = timestamp
      ? DateTime.fromISO(timestamp, { setZone: true })
      : null;
  }
);

/**
 * Convert duration string into Duration
 */
export const BawDuration = createDecorator(
  (model, key, seconds: number | Duration) => {
    if (seconds instanceof Duration) {
      return;
    }

    /*
    Extra object fields required, do not remove. Duration calculates itself
    based on the time spans provided, if years is removed for example,
    the output will just keep incrementing months (i.e 24 months, instead of 2 years).
  */
    model[key] = seconds
      ? Duration.fromObject({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds,
        }).normalize() // Normalize seconds into other keys (i.e 200 seconds => 3 minutes, 20 seconds)
      : null;
  }
);

/**
 * Abstract code required for baw decorators
 * @param setValue Set the value of the models decorated key
 */
function createDecorator(
  setValue: (model: AbstractModel, key: symbol, ...args: any[]) => void
) {
  return (opts?: BawDecoratorOptions) => (
    model: AbstractModel,
    key: string
  ) => {
    // Store decorated keys value
    const decoratedKey = Symbol("_" + key);

    Object.defineProperty(model, key, {
      get() {
        // If model was never set, it must be undefined
        if (this[decoratedKey] === undefined) {
          setValue(this, decoratedKey, undefined);
        }

        return this[decoratedKey];
      },
      set(args: any) {
        // Ignore setter method if key reads value from override key
        if (opts?.key) {
          return;
        }
        setValue(this, decoratedKey, args);
      },
    });

    // If override key provided, intercept its getter to update the decorated key
    if (opts?.key) {
      // Store override keys value
      const overrideKey = Symbol("_" + opts.key);

      Object.defineProperty(model, opts.key, {
        get() {
          return this[overrideKey];
        },
        set(args: any) {
          // Update override key and set decorated key
          this[overrideKey] = args;
          setValue(this, decoratedKey, args);
        },
      });
    }

    // Should key persist in toJSON method
    if (opts?.persist) {
      BawPersistAttr(model, key);
    }
  };
}

interface BawDecoratorOptions {
  /**
   * Persist key in models toJSON() method
   */
  persist?: boolean;
  /**
   * Override key to read field data from another field
   */
  key?: string;
}
