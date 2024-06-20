import { Injector } from "@angular/core";
import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { MonoTuple } from "@helpers/advancedTypes";
import {
  deserializeParamsToObject,
  IQueryStringParameterSpec,
  jsBoolean,
  jsNumberArray,
  luxonDateArray,
  luxonDurationArray,
  serializeObjectToParams,
} from "@helpers/query-string-parameters/query-string-parameters";
import { CollectionIds } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { IParameterModel } from "@models/data/parametersModel";
import { ImplementsInjector } from "@models/ImplementsInjector";
import { DateTime, Duration } from "luxon";

export interface IVerificationParameters {}

const serializationTable: IQueryStringParameterSpec = {
  projects: jsNumberArray,
  regions: jsNumberArray,
  sites: jsNumberArray,
  tags: jsNumberArray,
  onlyUnverified: jsBoolean,
  date: luxonDateArray,
  time: luxonDurationArray,
};

export class VerificationParameters
  implements
    IVerificationParameters,
    ImplementsInjector,
    IParameterModel<AudioEvent>
{
  public constructor(
    protected queryStringParameters: Params = {},
    public injector?: Injector
  ) {
    const deserializedObject: IVerificationParameters =
      deserializeParamsToObject<IVerificationParameters>(
        queryStringParameters,
        serializationTable
      );

    Object.keys(deserializedObject).forEach((key: string) => {
      this[key] = deserializedObject[key];
    });
  }

  public projects: CollectionIds;
  public regions: CollectionIds;
  public sites: CollectionIds;
  public tags: CollectionIds;
  public onlyUnverified: boolean;
  public date: MonoTuple<DateTime, 2>;
  public time: MonoTuple<Duration, 2>;

  public toFilter(): Filters<AudioEvent> {
    return {};
  }

  public toQueryParams(): Params {
    return serializeObjectToParams<IVerificationParameters>(
      this,
      serializationTable
    );
  }
}
