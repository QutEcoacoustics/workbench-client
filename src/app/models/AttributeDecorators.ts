import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id, Ids, ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";

function persistAttr(
  model: AbstractModel,
  key: string,
  opts: boolean | BawPersistAttributeOptions
) {
  model[AbstractModel.createAttributesKey] ??= [];
  model[AbstractModel.updateAttributesKey] ??= [];

  if (typeof opts === "boolean") {
    if (!opts) {
      return;
    }
    model[AbstractModel.createAttributesKey].push(key);
    model[AbstractModel.updateAttributesKey].push(key);
    return;
  }

  if (opts.create) {
    model[AbstractModel.createAttributesKey].push(key);
  }
  if (opts.update) {
    model[AbstractModel.updateAttributesKey].push(key);
  }
}

/**
 * Add key to the models attributes
 */
export function bawPersistAttr(
  opts: BawPersistAttributeOptions = { create: true, update: true }
) {
  return function (model: AbstractModel, key: string) {
    persistAttr(model, key, opts);
  };
}

/**
 * Convert image url/s into an array of image urls
 */
export function bawImage<Model>(
  defaultUrl: string,
  opts?: BawDecoratorOptions<Model>
) {
  // Retrieve default image and prepend site url if required
  const defaultImage: ImageUrl = { size: ImageSizes.default, url: defaultUrl };

  const sortImageUrls = (a: ImageUrl, b: ImageUrl): -1 | 0 | 1 => {
    // Default image should always be last in array
    if (a.size === ImageSizes.default) {
      return 1;
    } else if (b.size === ImageSizes.default) {
      return -1;
    }

    const imageASize = a.height * a.width;
    const imageBSize = b.height * b.width;
    return imageASize === imageBSize ? 0 : imageASize > imageBSize ? -1 : 1;
  };

  function missingDefault(images: ImageUrl[]): boolean {
    return !images.find((image) => image.size === ImageSizes.default);
  }

  return createDecorator<Model>(
    opts,
    (model, key, imageUrls: string | ImageUrl[]) => {
      // Convert string to ImageURL[] and append default image
      if (typeof imageUrls === "string") {
        model[key] = [
          { size: ImageSizes.unknown, url: imageUrls },
          defaultImage,
        ];
      } else if (imageUrls instanceof Array && imageUrls.length > 0) {
        // Get API root
        const apiRoot = model["injector"]?.get(API_ROOT);
        if (!apiRoot) {
          throw new Error(
            `${model} does not have injector service. Tried to access ${key.toString()}`
          );
        }

        // Copy and sort image urls
        const output = imageUrls
          .map((imageUrl) => {
            const meta = { ...imageUrl };
            // Prepend api root to url if it begins with '/'
            if (meta.url.startsWith("/")) {
              meta.url = apiRoot + meta.url;
            }
            return meta;
          })
          .sort(sortImageUrls);

        // Append default image
        if (missingDefault(output)) {
          output.push(defaultImage);
        }

        model[key] = output;
      } else {
        model[key] = [defaultImage];
      }
    }
  );
}

/**
 * Convert a collection of ids into a set
 */
export function bawCollection<Model>(opts?: BawDecoratorOptions<Model>) {
  return createDecorator<Model>(opts, (model, key, ids: Id[] | Ids) => {
    if (ids instanceof Set) {
      return;
    }

    model[key] = new Set(ids ?? []);
  });
}

/**
 * Convert timestamp string into DateTimeTimezone
 */
export function bawDateTime<Model>(opts?: BawDecoratorOptions<Model>) {
  return createDecorator<Model>(
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
export function bawDuration<Model>(opts?: BawDecoratorOptions<Model>) {
  return createDecorator<Model>(
    opts,
    (model, key, seconds: number | Duration) => {
      if (seconds instanceof Duration) {
        return;
      }

      /*
      Extra object fields required, do not remove. Duration calculates itself
      based on the time spans provided, if years is removed for example,
      the output will just keep incrementing months (i.e 24 months, instead of 2 years).
      */
      model[key] = isInstantiated(seconds)
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
}

/**
 * Abstract code required for baw decorators
 *
 * @param opts Options to apply
 * @param setValue Set the value of the models decorated key
 */
function createDecorator<Model>(
  opts: BawDecoratorOptions<Model> = {},
  setValue: (model: AbstractModel, key: symbol, ...args: any[]) => void
) {
  return function (model: AbstractModel, key: string) {
    // Store decorated keys value
    const decoratedKey = Symbol("_" + key);
    let keySetter: (args: any) => void;

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
        configurable: true,
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
      configurable: true,
    });

    if (opts.persist) {
      // Add key to toJSON method
      persistAttr(model, key, opts.persist);
    }
  };
}

export interface BawDecoratorOptions<T> {
  /**
   * Persist key in models toJSON() method
   */
  persist?: boolean | BawPersistAttributeOptions;
  /**
   * Override key to read field data from another field
   */
  key?: keyof T;
}

interface BawPersistAttributeOptions {
  /** Include attribute in create requests for the model */
  create?: boolean;
  /** Include attribute in update requests for the model */
  update?: boolean;
}
