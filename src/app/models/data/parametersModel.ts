import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { IQueryStringParameterSpec } from "@helpers/query-string-parameters/query-string-parameters";
import { AbstractModelWithoutId } from "@models/AbstractModel";

export interface IParameterModel<T extends AbstractModelWithoutId> {
  toQueryParams(): Params;
  toFilter(): Filters<T>;
}

export function ParameterModel(serialization: IQueryStringParameterSpec) {
  return class Base<T extends AbstractModelWithoutId> implements IParameterModel<T> {
    public toQueryParams(): Params {
      throw new Error("Method not implemented.");
    }

    public toFilter(): Filters<T> {
      throw new Error("Method not implemented.");
    }
  }
}
