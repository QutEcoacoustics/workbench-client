import { Params } from "@angular/router";
import { TAG } from "@baw-api/ServiceTokens";
import {
  IQueryStringParameterSpec,
  jsNumber,
  jsString,
  serializeObjectToParams,
  withDefault,
} from "@helpers/query-string-parameters/queryStringParameters";
import { Id } from "@interfaces/apiInterfaces";
import { hasOne } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { IParameterModel, ParameterModel } from "@models/data/parametersModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Filters } from "@baw-api/baw-api.service";
import { verificationStatusOptions } from "../annotation-search-form/annotationSearchParameters";

// The verification status options map can be found in the
// AnnotationSearchParameter's getters.
// I have to use a getter because some of the filter conditions depend on the
// session state.
export type VerificationStatusKey = "unverified-for-me" | "unverified" | "any";

export type TaskBehaviorKey = "verify-and-correct-tag" | "verify";

export interface IVerificationParameters {
  taskBehavior: TaskBehaviorKey;
  verificationStatus: VerificationStatusKey;
  taskTag: Id<Tag>;
}

const serializationTable: IQueryStringParameterSpec<IVerificationParameters> = {
  taskTag: jsNumber,
  verificationStatus: withDefault(jsString, "unverified-for-me"),
  taskBehavior: withDefault(jsString, "verify"),
};

export class VerificationParameters
  extends ParameterModel<AudioEvent>(serializationTable)
  implements IVerificationParameters, IParameterModel<AudioEvent>
{
  public taskTag: Id<Tag>;
  public taskBehavior: TaskBehaviorKey;
  public verificationStatus: VerificationStatusKey;

  public constructor(
    protected queryStringParameters: Params = {},
    public user?: User,
    public injector?: AssociationInjector,
  ) {
    super(queryStringParameters);
  }

  @hasOne(TAG, "taskTag")
  public taskTagModel?: Tag;

  public toQueryParams(): Params {
    return serializeObjectToParams<IVerificationParameters>(
      this,
      serializationTable,
    );
  }

  public toFilter(): Filters<AudioEvent> {
    const filter = verificationStatusOptions(this.user).get(
      this.verificationStatus,
    );

    return { filter };
  }
}
