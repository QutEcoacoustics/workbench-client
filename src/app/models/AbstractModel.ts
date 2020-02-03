
export abstract class  AbstractModel {
  constructor(raw: object) {
    return Object.assign(this, raw);
  }

  public readonly id: number;

  public static Create<T extends AbstractModel>(
    _new: new(_: object) => T,
    raw: object): T {
    return new _new(raw);
  }
}
