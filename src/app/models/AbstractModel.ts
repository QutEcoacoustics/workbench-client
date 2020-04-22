import { Injector } from "@angular/core";
import { ApiFilter, ApiShow, IdOr } from "@baw-api/api-common";
import { ServiceToken } from "@baw-api/ServiceTokens";
import { DateTime, Duration } from "luxon";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Id, Ids } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";

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
   * Model attributes. This is used to generate the toJSON() output of the model.
   */
  private _attributes: string[];

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
    this._attributes.forEach((attribute) => {
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
   * @deprecated
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
  serviceToken: ServiceToken<ApiFilter<AbstractModel, any[]>>,
  modelIdentifier: (model: AbstractModel) => Ids,
  modelPrimaryKey: string = "id"
) {
  return (model: AbstractModel, associationKey: string) => {
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
  serviceToken: ServiceToken<
    ApiShow<AbstractModel, any[], IdOr<AbstractModel>>
  >,
  modelIdentifier: (model: AbstractModel) => Id,
  ids: string[] = []
) {
  return (model: AbstractModel, associationKey: string) => {
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
 * @param model Target model
 * @param associationKey Key to identify associated model
 * @param params Property to extract IDs from
 * @param createRequest Create API Request
 */
function createGetter<S>(
  serviceToken: ServiceToken<S>,
  model: AbstractModel,
  associationKey: string,
  modelIdentifier: (model: AbstractModel) => Id | Ids,
  createRequest: (
    service: S,
    params: Id | Ids
  ) => Observable<AbstractModel | AbstractModel[]>
) {
  Object.defineProperty(model, associationKey, {
    get(this: AbstractModel) {
      // If model has no injector, error out
      const injector = this["injector"];
      if (!injector) {
        throw new Error("Model does not have injector service.");
      }

      // If field is undefined, return null result
      const identifier = modelIdentifier(this);
      if (identifier === undefined || identifier === null) {
        return of(null);
      }

      // If result cached (eg. sites cached at _sites), return cached result
      const cachedModel = `_${associationKey}`;
      if (this.hasOwnProperty(cachedModel)) {
        return of(this[cachedModel]);
      }

      // Create service and request from API
      const service = injector.get(serviceToken.token);
      return createRequest(service, identifier).pipe(
        map((response) => {
          // Cache model and return
          Object.defineProperty(model, cachedModel, {
            value: response,
            configurable: false,
          });

          return response;
        })
      );
    },
  });
}

/**
 * Add key to the models attributes
 */
export function BawPersistAttr(model: AbstractModel, key: string) {
  if (!model["_attributes"]) {
    model["_attributes"] = [];
  }

  model["_attributes"].push(key);
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
