export abstract class AbstractData<T = Record<PropertyKey, any>> {
  public constructor(raw: T) {
    return Object.assign(this, raw);
  }

  public readonly kind: string;
}
