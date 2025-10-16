import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import {
  IQueryStringParameterSpec,
  jsNumber,
} from "@helpers/query-string-parameters/queryStringParameters";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { IParameterModel, ParameterModel } from "@models/data/parametersModel";
import { Site } from "@models/Site";

export interface IEventMapSearchParameters {
  focused: Id<Site> | null;
}

// we exclude project, region, and site from the serialization table because
// we do not want them emitted in the query string
const serializationTable: IQueryStringParameterSpec<
  Partial<IEventMapSearchParameters>
> = {
  focused: jsNumber,
};

const deserializationTable: IQueryStringParameterSpec<
  Partial<IEventMapSearchParameters>
> = {
  ...serializationTable,
};

export class EventMapSearchParameters
  extends ParameterModel<AudioEvent>(deserializationTable)
  implements IEventMapSearchParameters, IParameterModel<AudioEvent>
{
  public focused: Id<Site>;

  public constructor(queryStringParameters: Params = {}) {
    super(queryStringParameters);
  }

  public toQueryParams(): Params {
    return {
      focused: this.focused,
    };
  }

  public toFilter(): Filters<AudioEvent, keyof AudioEvent> {
    return {};
  }
}
