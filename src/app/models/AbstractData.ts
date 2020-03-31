export abstract class AbstractData {
  constructor(raw: object) {
    return Object.assign(this, raw);
  }

  public readonly kind: string;
}
