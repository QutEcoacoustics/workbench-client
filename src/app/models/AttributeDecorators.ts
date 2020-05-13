import { Id, Ids } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";

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
export function BawCollection<T extends AbstractModel>(
  opts?: BawDecoratorOptions<T>
) {
  return createDecorator<T>(opts, (model, key, ids: Id[] | Ids) => {
    if (ids instanceof Set) {
      return;
    }

    model[key] = new Set(ids || []);
  });
}

/**
 * Convert timestamp string into DateTimeTimezone
 */
export function BawDateTime<T extends AbstractModel>(
  opts?: BawDecoratorOptions<T>
) {
  return createDecorator<T>(
    opts,
    (model, key, timestamp: string | DateTime) => {
      if (timestamp instanceof DateTime) {
        return;
      }

      model[key] = timestamp
        ? DateTime.fromISO(timestamp, { setZone: true })
        : null;
    }
  );
}

/**
 * Convert duration string into Duration
 */
export function BawDuration<T extends AbstractModel>(
  opts?: BawDecoratorOptions<T>
) {
  return createDecorator<T>(opts, (model, key, seconds: number | Duration) => {
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
  });
}

/**
 * Abstract code required for baw decorators
 * @param opts Options to apply
 * @param setValue Set the value of the models decorated key
 */
function createDecorator<T extends AbstractModel>(
  opts: BawDecoratorOptions<T> = {},
  setValue: (model: AbstractModel, key: symbol, ...args: any[]) => void
) {
  return function (model: AbstractModel, key: string) {
    // Store decorated keys value
    const decoratedKey = Symbol("_" + key);
    let keySetter = undefined;

    // If override key provided, intercept its getter to update the decorated key
    if (opts?.key) {
      // Store override keys value
      const overrideKey = Symbol("_" + opts.key);

      // Update override key access
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
    } else {
      // Whenever someone tries to set attribute, update decorated value instead
      keySetter = function (args: any) {
        setValue(this, decoratedKey, args);
      };
    }

    // Update attribute access
    Object.defineProperty(model, key, {
      get() {
        // If model was never set, it must be undefined
        if (this[decoratedKey] === undefined) {
          setValue(this, decoratedKey, undefined);
        }
        return this[decoratedKey];
      },
      set: keySetter,
    });

    if (opts.persist) {
      // Add key to toJSON method
      BawPersistAttr(model, key);
    }
  };
}

interface BawDecoratorOptions<T> {
  /**
   * Persist key in models toJSON() method
   */
  persist?: boolean;
  /**
   * Override key to read field data from another field
   */
  key?: keyof T;
}
