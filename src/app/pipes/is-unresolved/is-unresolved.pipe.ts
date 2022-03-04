import { Pipe, PipeTransform } from "@angular/core";
import { AccessLevel } from "@interfaces/apiInterfaces";
import { AbstractModel, isUnresolvedModel } from "@models/AbstractModel";

/**
 * Evaluate if a model, or array or models, is resolved
 */
@Pipe({
  name: "isUnresolved",
})
export class IsUnresolvedPipe implements PipeTransform {
  public transform(
    value: Readonly<AbstractModel | AbstractModel[]> | AccessLevel
  ): boolean {
    const isUnresolvedAccessLevel = value === AccessLevel.unresolved;
    return (
      isUnresolvedAccessLevel ||
      isUnresolvedModel(value as AbstractModel | AbstractModel[])
    );
  }
}
