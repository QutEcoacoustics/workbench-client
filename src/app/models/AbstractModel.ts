import { Injector } from "@angular/core";
import { Writeable, XOR } from "@helpers/advancedTypes";
import { DateTime, Duration } from "luxon";
import { Id } from "../interfaces/apiInterfaces";
import { Meta } from "../services/baw-api/baw-api.service";

export type AbstractModelConstructor<Model> = new (
  _: Record<string, any>,
  _injector?: Injector
) => Model;

/**
 * BAW Server Abstract Model
 */
export abstract class AbstractModelWithoutId<Model = Record<string, any>> {
  public constructor(raw: Model, protected injector?: Injector) {
    return Object.assign(this, raw);
  }

  /**
   * Redirect path to view model on website. This is a string which can be used
   * by the UrlDirective (`[bawUrl]`) to navigate. For example using the project
   * abstract model, this path would direct to the project page. The url may
   * include query parameters, and is thus incompatible with `[routerLink]` and
   * `Router.navigateByUrl()`.
   */
  public abstract get viewUrl(): string;

  /** Keys for accessing hidden data associated with a model */
  public static keys = {
    /** This stores the metadata associated with the model */
    meta: Symbol("meta"),
    /**
     * This stores the list of model attributes which are used to generate
     * bodies for create api requests
     */
    create: {
      /** Used to generate the toJSON({create: true}) output */
      jsonAttributes: Symbol("create-json-attributes"),
      /** Used to generate the toFormData(..., {create: true}) output */
      multiPartAttributes: Symbol("create-multi-part-attributes"),
    },
    /**
     * This stores the list of model attributes which are used to generate
     * bodies for update api requests
     */
    update: {
      /** Used to generate the toJSON({update: true}) output */
      jsonAttributes: Symbol("update-json-attributes"),
      /** Used to generate the toFormData(..., {update: true}) output */
      multiPartAttributes: Symbol("update-multi-part-attributes"),
    },
  };

  /**
   * Model type name. This should match the name set in baw-server as it may
   * be used in multi-part requests
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

  /**
   * Convert model to JSON
   */
  public toJSON(opts?: ModelSerializationOptions): Partial<this> {
    let keys: string[];
    if (!opts) {
      keys = this.getModelAttributes();
    } else if (opts.create) {
      keys = this[AbstractModel.keys.create.jsonAttributes];
    } else {
      keys = this[AbstractModel.keys.update.jsonAttributes];
    }
    return this.toObject(keys);
  }

  /** Convert model to FormData */
  public toFormData(opts?: ModelSerializationOptions): FormData {
    const output = new FormData();
    let keys: string[];
    if (!opts) {
      keys = this.getModelAttributes();
    } else if (opts.create) {
      keys = this[AbstractModel.keys.create.multiPartAttributes];
    } else {
      keys = this[AbstractModel.keys.update.multiPartAttributes];
    }

    const data = this.toObject(keys);
    for (const attribute of Object.keys(data)) {
      // Do not surround attribute name in quotes, it is not a valid input
      output.append(`${this.kind}[${attribute}]`, data[attribute]);
    }
    return output;
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

  /**
   * Converts the model and a list of keys, into an object containing each key
   * value pair
   *
   * @param keys List of attributes to retrieve
   */
  private toObject(keys: string[]): Partial<this> {
    const output: Partial<Writeable<this>> = {};
    keys.forEach((attribute: keyof AbstractModel) => {
      const value = this[attribute];
      if (value instanceof Set) {
        output[attribute] = JSON.stringify(Array.from(value));
      } else if (value instanceof DateTime) {
        output[attribute] = value.toISO();
      } else if (value instanceof Duration) {
        output[attribute] = value.as("seconds").toLocaleString();
      } else {
        output[attribute] = this[attribute] as any;
      }
    });
    return output;
  }

  /**
   * Retrieves a list of all attributes associated with the model which are
   * not the injector
   */
  private getModelAttributes(): string[] {
    return Object.keys(this).filter((key) => key !== "injector");
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
  public readonly kind = "UnresolvedModel";

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

export const unknownViewUrl = "/not_implemented";
export function getUnknownViewUrl(errorMsg: string) {
  console.warn(errorMsg);
  return unknownViewUrl;
}

export type ModelSerializationOptions = XOR<
  { create: boolean },
  { update: boolean }
>;
