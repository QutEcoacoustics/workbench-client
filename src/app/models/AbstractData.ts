export abstract class AbstractData {
  public constructor(raw: Record<string, any>) {
    return Object.assign(this, raw);
  }

  public readonly kind: string;
}
