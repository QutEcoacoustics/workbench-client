import { Params } from "@angular/router";
import { TAG } from "@baw-api/ServiceTokens";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  IQueryStringParameterSpec,
  jsNumber,
  jsNumberArray,
  jsString,
  serializeObjectToParams,
  withDefault,
} from "@helpers/query-string-parameters/queryStringParameters";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { hasMany, hasOne } from "@models/AssociationDecorators";
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

  tags: Ids<Tag>;
  taskTag: Id<Tag>;
}

const serializationTable: IQueryStringParameterSpec<IVerificationParameters> = {
  tags: jsNumberArray,
  taskTag: jsNumber,

  verificationStatus: withDefault(jsString, "unverified-for-me"),
  taskBehavior: withDefault(jsString, "verify"),
};

export class VerificationParameters
  extends ParameterModel<AudioEvent>(serializationTable)
  implements IVerificationParameters, IParameterModel<AudioEvent>
{
  public tags: Ids<Tag>;
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

  // We cannot use a set here because we use the index of tags as the priority.
  // Meaning that if we used a set, we could not use indexOf to find the
  // priority of a tag.
  // While we could convert to an Array for the indexOf call, I'd like to
  // convert as early as possible so we don't have types changing depending on
  // the context.
  public get tagPriority(): Id<Tag>[] {
    const baseTags = this.tags ?? [];

    if (isInstantiated(this.taskTag)) {
      const uniqueIds = new Set([this.taskTag, ...baseTags]);
      return Array.from(uniqueIds);
    }

    return Array.from(baseTags);
  }

  @hasMany(TAG, "tags")
  public tagModels?: Tag[];

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
