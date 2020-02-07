import { Meta } from "../services/baw-api/base-api.service";

export abstract class AbstractModel {
  constructor(raw: object) {
    return Object.assign(this, raw);
  }

  public static fromJSON: (obj: any) => AbstractModel;
  private static metaKey = Symbol("meta");
  public readonly id?: number;
  public abstract toJSON: () => object;

  public static Create<T extends AbstractModel>(
    _new: new (_: object) => T,
    raw: object
  ): T {
    return new _new(raw);
  }

  public addMetadata(meta: Meta) {
    this[AbstractModel.metaKey] = meta;
  }

  public getMetadata(): Meta {
    return this[AbstractModel.metaKey];
  }
}
