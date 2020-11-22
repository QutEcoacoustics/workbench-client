import { Pipe, PipeTransform } from '@angular/core';
import { AbstractModel, UnresolvedModel } from '@models/AbstractModel';

/**
 * Evaluate if a model, or array or models, is resolved
 */
@Pipe({
  name: 'isUnresolved',
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
