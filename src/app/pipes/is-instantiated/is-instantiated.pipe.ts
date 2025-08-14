import { Pipe, PipeTransform } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";

/**
 * Evaluate if a value is not undefined or null
 * This is useful in ngIf statements to check if a value is defined
 */
@Pipe({ name: "isInstantiated" })
export class isInstantiatedPipe<T> implements PipeTransform {
  public transform(value: T): boolean {
    return isInstantiated(value);
  }
}
