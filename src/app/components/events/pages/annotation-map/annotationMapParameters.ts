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

export interface IAnnotationMapParameters {
  focused: Id<Site> | null;
}

const serializationTable: IQueryStringParameterSpec<
  Partial<IAnnotationMapParameters>
> = {
  focused: jsNumber,
};

export class AnnotationMapParameters
  extends ParameterModel<AudioEvent>(serializationTable)
  implements IAnnotationMapParameters, IParameterModel<AudioEvent>
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
