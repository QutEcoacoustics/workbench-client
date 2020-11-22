export abstract class AbstractData {
  public constructor(raw: object) {
    return Object.assign(this, raw);
  }

  public readonly kind: string;
}
