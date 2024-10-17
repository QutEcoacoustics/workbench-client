import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { AbstractModelWithoutId } from "@models/AbstractModel";

export interface IParameterModel<T extends AbstractModelWithoutId> {
  toQueryParams(): Params;
  toFilter(): Filters<T>;
}
