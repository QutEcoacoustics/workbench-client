import { Pipe, PipeTransform } from "@angular/core";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";

@Pipe({
  name: "isUnresolved",
})
export class IsUnresolvedPipe implements PipeTransform {
  public transform(
    value: AbstractModel | AbstractModel[] | Readonly<AbstractModel[]>
  ): boolean {
    const isSingle = value === UnresolvedModel.one;
    const isMultiple = value === UnresolvedModel.many;
    return isSingle || isMultiple;
  }
}
