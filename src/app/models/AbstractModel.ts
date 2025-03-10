import { Writeable, XOR } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import camelCase from "just-camel-case";
import snakeCase from "just-snake-case";
import { DateTime, Duration } from "luxon";
import { Id } from "../interfaces/apiInterfaces";
import {
  Capability,
  CapabilityKey,
  Meta,
} from "../services/baw-api/baw-api.service";
import { BawAttributeMeta } from "./AttributeDecorators";
import { AssociationInjector } from "./ImplementsInjector";

export type AbstractModelConstructor<Model> = new (
  _: Record<string, any>,
  _injector?: AssociationInjector
) => Model;

interface SerializationConversionOptions {
  convertCase?: boolean;
  formData?: boolean;
}

type SerializationTargets = XOR<{ create: boolean }, { update: boolean }>;
type ModelSerializationOptions = SerializationTargets &
  SerializationConversionOptions;

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModelWithoutId<Model = Record<string, any>> {
  public constructor(
    raw: Readonly<Model>,
    protected injector?: AssociationInjector
  ) {
    const transformedRaw = this.getPersistentAttributes()
      .filter((attr) => attr.convertCase)
      .reduce((acc, attr) => {
        const value = raw[attr.key];
        acc[attr.key] = isInstantiated(value) ? camelCase(value) : value;
        return acc;
      }, {});

    Object.assign(this, raw, transformedRaw);
  }

  /** Keys for accessing hidden data associated with a model */
  private static keys = {
    /** This stores the metadata associated with the model */
    meta: Symbol("meta"),
    /**
     * This stores the list of model attribute metadata which are used to
     * generate bodies for create api requests
     */
    attributes: Symbol("attributes"),
  };

  /**
   * Redirect path to view model on website. This is a string which can be used
   * by the UrlDirective (`[bawUrl]`) to navigate. For example using the project
   * abstract model, this path would direct to the project page. The url may
   * include query parameters, and is thus incompatible with `[routerLink]` and
   * `Router.navigateByUrl()`.
   */
  public abstract get viewUrl(): string;

  /**
   * Model type name. This value is used when making API requests and must
   * match up with what the baw-server names the model. It will be converted to
   * snake case.
   */
  public readonly kind: string;

  /**
   * Redirect path to view model on website. This is a string which can be used
   * by the UrlDirective (`[bawUrl]`) to navigate. For example using the project
   * abstract model, this path would direct to the project page. The url may
   * include query parameters, and is thus incompatible with `[routerLink]` and
   * `Router.navigateByUrl()`.
   *
   * @param args Url arguments
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getViewUrl(...args: any[]): string {
    return this.viewUrl;
  }

  public toJSON(): Partial<this> {
    return this.toObject(this.getModelAttributes());
  }

  /**
   * Convert model to string.
   *
   * @param value Display custom value
   */
  public toString(value: string): string {
    return `${this.kind}: ${value}`;
  }

  /**
   * Add hidden metadata to model
   *
   * @param meta Metadata
   */
  public addMetadata(meta: Meta): void {
    this[AbstractModel.keys.meta] = meta;
  }

  /** Get hidden model metadata */
  public getMetadata(): Meta {
    return this[AbstractModel.keys.meta];
  }

  public addPersistentAttribute(meta: BawAttributeMeta) {
    return this.getPersistentAttributes().push(meta);
  }

  public getPersistentAttributes(): BawAttributeMeta[] {
    // TODO #1005 Store this statically in the model
    return (this[AbstractModel.keys.attributes] ??= []);
  }

  public can(capability: CapabilityKey): Capability {
    return this.getMetadata().capabilities[capability];
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ create: true })
   * public x = 2
   * ```
   *
   * ```ts
   * hasJsonOnlyAttributesForCreate() => { x: 2 }
   * ```
   */
  public hasJsonOnlyAttributesForCreate(): boolean {
    return this.hasJsonOnlyAttributes({ create: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ create: true })
   * public x = 2;
   * ```
   *
   * ```ts
   * getJsonAttributesForCreate() => { x: 2 }
   * ```
   */
  public getJsonAttributesForCreate(): Partial<this> {
    return this.jsonAttributes({ create: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ update: true })
   * public x = 2;
   * ```
   *
   * ```ts
   * hasJsonOnlyAttributesForUpdate() => { x: 2 }
   * ```
   */
  public hasJsonOnlyAttributesForUpdate(): boolean {
    return this.hasJsonOnlyAttributes({ update: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ update: true })
   * public x = 2;
   * ```
   *
   * ```ts
   * getJsonAttributesForUpdate() => { x: 2 }
   * ```
   */
  public getJsonAttributesForUpdate(): Partial<this> {
    return this.jsonAttributes({ update: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ create: true, supportedFormats: ["formData"] })
   * public x = 2;
   * ```
   *
   * ```ts
   * hasFormDataOnlyAttributesForCreate() => { x: 2 }
   * ```
   */
  public hasFormDataOnlyAttributesForCreate(): boolean {
    return this.hasFormDataOnlyAttributes({ create: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ create: true, supportedFormats: ["formData"] })
   * public x = 2;
   * ```
   *
   * ```ts
   * getFormDataOnlyAttributesForCreate() => { x: 2 }
   * ```
   */
  public getFormDataOnlyAttributesForCreate(): FormData {
    return this.formDataOnlyAttributes({ create: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ update: true, supportedFormats: ["formData"] })
   * public x = 2;
   * ```
   *
   * ```ts
   * hasFormDataOnlyAttributesForUpdate() => { x: 2 }
   * ```
   */
  public hasFormDataOnlyAttributesForUpdate(): boolean {
    return this.hasFormDataOnlyAttributes({ update: true });
  }

  /**
   * @example
   * ```ts
   * @bawPersistAttr({ update: true, supportedFormats: ["formData"] })
   * public x = 2;
   * ```
   *
   * ```ts
   * getFormDataOnlyAttributesForUpdate() => { x: 2 }
   * ```
   */
  public getFormDataOnlyAttributesForUpdate(): FormData {
    return this.formDataOnlyAttributes({ update: true });
  }

  private hasJsonOnlyAttributes(opts?: ModelSerializationOptions): boolean {
    return this.getModelAttributes({ ...opts, formData: false }).some((attr) =>
      isInstantiated(this[attr])
    );
  }

  /**
   * Convert model to JSON compatible object containing attributes which should
   * be sent in a JSON API request
   */
  private jsonAttributes(opts?: ModelSerializationOptions): Partial<this> {
    return this.toObject(this.getModelAttributes(opts), opts);
  }

  /**
   * Determine if the current model has any attributes set which should be sent
   * in a multipart form API request
   */
  private hasFormDataOnlyAttributes(opts?: ModelSerializationOptions): boolean {
    return this.getModelAttributes({ ...opts, formData: true }).some((attr) =>
      isInstantiated(this[attr])
    );
  }

  /**
   * Convert model to FormData containing attributes which should be sent in a
   * multipart form API request. Call `hasFormDataOnlyAttributes` before using
   * this value.
   */
  private formDataOnlyAttributes(
    opts?: ModelSerializationOptions
  ): FormData {
    const output = new FormData();
    const keys = this.getModelAttributes({ ...opts, formData: true });
    const data = this.toObject(keys, opts);

    if (!this.kind) {
      console.error("Model does not have a kind attribute", this);
      throw Error("Model does not have a kind attribute");
    }

    for (const attr of Object.keys(data)) {
      const dataValue = data[attr];

      if (!isInstantiated(dataValue)) {
        continue;
      }

      /*
       * Do not surround attribute name in quotes, it is not a valid input and
       * baw-server will return a 500 response. Attributes are in the form of
       * model_name[attribute_name] for scalar values and model_name[attribute_name][] for array values
       *
       * NOTE: For JSON data, our interceptor converts keys and values to
       * snakeCase, this case is more one-off and so an interceptor has not been built
       */
      const modelName = snakeCase(this.kind);
      const snakeCaseAttr = snakeCase(attr);

      // file lists are commonly uploaded via FormData
      // however, a FileList is actually an object and not an array that implements an iterator
      // we therefore need to use a separate condition to handle this case
      if (dataValue instanceof FileList) {
        for (const value of dataValue) {
          output.append(`${modelName}[${snakeCaseAttr}]`, value);
        }
      } else if (Array.isArray(dataValue)) {
        if (dataValue.length === 0) {
          continue;
        }

        for (const dataValueItem of dataValue) {
          output.append(`${modelName}[${snakeCaseAttr}][]`, dataValueItem);
        }
      } else {
        output.append(`${modelName}[${snakeCaseAttr}]`, dataValue);
      }
    }

    return output;
  }

  /**
   * Converts the model and its values into a simpler object representation
   * which is suitable for serialization. Only the `keys` specified are
   * included in the result.
   *
   * @param keys List of attributes to extract
   */
  private toObject(
    keys: string[],
    opts?: ModelSerializationOptions
  ): Partial<this> {
    const output: Partial<Writeable<this>> = {};
    keys.forEach((attribute: keyof AbstractModel) => {
      const value = this[attribute];
      if (value instanceof Set) {
        const valueAsArray = Array.from(value);
        output[attribute] = opts?.convertCase
          ? valueAsArray.map(snakeCase)
          : valueAsArray;
      } else if (value instanceof DateTime) {
        output[attribute] = value.toISO();
      } else if (value instanceof Duration) {
        output[attribute] = value.as("seconds");
      } else {
        output[attribute] = opts?.convertCase
          ? snakeCase(this[attribute])
          : this[attribute];
      }
    });
    return output;
  }

  /**
   * Retrieves a list of all attributes associated with the model which are
   * not the injector
   */
  private getModelAttributes(opts?: ModelSerializationOptions): string[] {
    if (opts?.create || opts?.update) {
      return (
        this.getPersistentAttributes()
          .filter((meta) => (opts.create ? meta.create : meta.update))
          // The following filter splits values for attributes that support both json and formData formats
          // when a  null value is present, we send the value in the json request
          // when a File value is present, we send the value in the formData request
          // The null/json scenario is used to support deleting images.
          .filter((meta) =>
            this[meta.key] instanceof File ? opts.formData : true
          )
          .filter((meta) =>
            meta.supportedFormats.includes(opts.formData ? "formData" : "json")
          )
          .map((meta) => meta.key)
      );
    } else {
      return Object.keys(this).filter((key) => key !== "injector");
    }
  }
}

export abstract class AbstractModel<
  Model = Record<string, any>
> extends AbstractModelWithoutId<Model> {
  /** Model ID */
  public readonly id?: Id;

  /**
   * Convert model to string.
   *
   * @param value Display custom value
   */
  public override toString(value?: string): string {
    if (!value && this["name"]) {
      value = this["name"];
    }
    const identifier = value ? `${value} (${this.id})` : this.id.toString();
    return super.toString(identifier);
  }
}

export class UnresolvedModel extends AbstractModel {
  private static readonly model = Object.freeze(new UnresolvedModel());
  private static readonly models = Object.freeze([]);
  public readonly kind = "Unresolved Model";

  public static get one(): Readonly<UnresolvedModel> {
    return this.model;
  }

  public static get many(): Readonly<UnresolvedModel[]> {
    return this.models;
  }

  public constructor() {
    super({});
  }

  public toString(): string {
    return "UnresolvedModel";
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

export function isUnresolvedModel<T extends AbstractModel>(
  model: Readonly<T | T[] | UnresolvedModel>
): model is UnresolvedModel {
  return model === UnresolvedModel.one || model === UnresolvedModel.many;
}

export const unknownViewUrl = "/not_implemented";
export function getUnknownViewUrl(errorMsg: string) {
  console.warn(errorMsg);
  return unknownViewUrl;
}
