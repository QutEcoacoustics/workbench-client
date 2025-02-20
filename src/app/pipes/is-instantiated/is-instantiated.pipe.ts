import { Pipe, PipeTransform } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";

/**
 * Evaluate if a value is not undefined or null
 * This is useful in ngIf statements to check if a value is defined
 */
@Pipe({
  name: "isInstantiated",
})
export class isInstantiatedPipe implements PipeTransform {
  public transform(
    value: Readonly<AbstractModel | AbstractModel[]> | PermissionLevel
  ): boolean {
    return isInstantiated(value);
  }
}
