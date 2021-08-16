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
export abstract class AbstractModel<Model = Record<string, any>> {
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

  /**
   * Hidden meta symbol
   * This stores the metadata associated with the model
   */
  private static metaKey = Symbol("meta");

  /**
   * Hidden attributes symbol.
   * This stores the list of model attributes which are used to
   * generate the toJSON({create: true}) output.
   */
  public static createAttributesKey = Symbol("create-attributes");
  /**
   * Hidden attributes symbol.
   * This stores the list of model attributes which are used to
   * generate the toJSON({update: true}) output.
   */
  public static updateAttributesKey = Symbol("update-attributes");

  /**
   * Model ID
   */
  public readonly id?: Id;

  /**
   * Model Identifier
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
    const output: Partial<Writeable<this>> = {};
    let keys: string[];
    if (!opts) {
      keys = Object.keys(this).filter((key) => key !== "injector");
    } else if (opts.create) {
      keys = this[AbstractModel.createAttributesKey];
    } else {
      keys = this[AbstractModel.updateAttributesKey];
    }

    keys.forEach((attribute: keyof AbstractModel) => {
      const value = this[attribute];
      if (value instanceof Set) {
        output[attribute] = Array.from(value) as any;
      } else if (value instanceof DateTime) {
        output[attribute] = value.toISO() as any;
      } else if (value instanceof Duration) {
        output[attribute] = value.as("seconds") as any;
      } else {
        output[attribute] = this[attribute] as any;
      }
    });
    return output;
  }

  /**
   * Convert model to string.
   *
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
   *
   * @param meta Metadata
   */
  public addMetadata(meta: Meta): void {
    this[AbstractModel.metaKey] = meta;
  }

  /**
   * Get hidden model metadata
   */
  public getMetadata(): Meta {
    return this[AbstractModel.metaKey];
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
