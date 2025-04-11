import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel, getUnknownViewUrl } from "@models/AbstractModel";
import { AssociationInjector } from "@models/ImplementsInjector";

export class MockModel extends AbstractModel {
  public kind = "Mock Model";
  public readonly id: Id;

  public constructor(
    raw: Record<string, any>,
    protected injector?: AssociationInjector,
  ) {
    super({ id: 1, ...raw }, injector);
  }

  public override getJsonAttributesForCreate(): Partial<this> {
    return { id: this.id } as any;
  }

  public override getJsonAttributesForUpdate(): Partial<this> {
    return { id: this.id } as any;
  }

  public get viewUrl(): string {
    return getUnknownViewUrl("Mock Model does not have a viewUrl");
  }
}
