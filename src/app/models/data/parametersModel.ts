import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import {
  deserializeParamsToObject,
  IQueryStringParameterSpec,
} from "@helpers/query-string-parameters/queryStringParameters";
import { AbstractData } from "@models/AbstractData";
import { AbstractModelWithoutId } from "@models/AbstractModel";

export interface IParameterModel<T extends AbstractModelWithoutId> {
  toQueryParams(): Params;
  toFilter(): Filters<T, keyof T>;
}

export function ParameterModel<const T extends AbstractModelWithoutId>(
  deserializationSpec: IQueryStringParameterSpec,
) {
  return class Base extends AbstractData implements IParameterModel<T> {
    public constructor(queryStringParameters: Params = {}) {
      const deserializedObject = deserializeParamsToObject(
        queryStringParameters,
        deserializationSpec,
      );

      const objectData = {};
      const objectKeys = Object.keys(deserializedObject);
      for (const key of objectKeys) {
        objectData[key] = deserializedObject[key];
      }

      super(objectData);
    }

    public toQueryParams(): Params {
      throw new Error("Method not implemented.");
    }

    public toFilter(): Filters<T, keyof T> {
      throw new Error("Method not implemented.");
    }
  };
}
