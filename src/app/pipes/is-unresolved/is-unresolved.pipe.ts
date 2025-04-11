import { Pipe, PipeTransform } from "@angular/core";
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { AbstractModel, isUnresolvedModel } from "@models/AbstractModel";

/**
 * Evaluate if a model, or array or models, is resolved
 */
@Pipe({ name: "isUnresolved" })
export class IsUnresolvedPipe implements PipeTransform {
  public transform(
    value: Readonly<AbstractModel | AbstractModel[]> | PermissionLevel
  ): boolean {
    const isUnresolvedAccessLevel = value === PermissionLevel.unresolved;
    return (
      isUnresolvedAccessLevel ||
      isUnresolvedModel(value as AbstractModel | AbstractModel[])
    );
  }
}
