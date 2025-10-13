import { Params } from "@angular/router";
import {
  AnnotationSearchParameters,
  IAnnotationSearchParameters,
} from "@components/annotations/pages/annotationSearchParameters";
import {
  deserializeParamsToObject,
  IQueryStringParameterSpec,
  jsNumber,
} from "@helpers/query-string-parameters/queryStringParameters";
import { Id } from "@interfaces/apiInterfaces";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Site } from "@models/Site";
import { User } from "@models/User";

export interface IEventMapSearchParameters extends IAnnotationSearchParameters {
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
  extends AnnotationSearchParameters
  implements IEventMapSearchParameters
{
  public focused: Id<Site> | null = null;

  public constructor(
    protected queryStringParameters: Params = {},
    public user?: User,
    public injector?: AssociationInjector,
  ) {
    super(queryStringParameters, user, injector);

    const deserializedObject: IEventMapSearchParameters =
      deserializeParamsToObject<IEventMapSearchParameters>(
        queryStringParameters,
        deserializationTable,
      );

    const objectKeys = Object.keys(deserializedObject);
    for (const key of objectKeys) {
      this[key] = deserializedObject[key];
    }
  }
}
