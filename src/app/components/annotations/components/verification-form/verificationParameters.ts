import { Params } from "@angular/router";
import { TAG } from "@baw-api/ServiceTokens";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  IQueryStringParameterSpec,
  jsNumber,
  jsString,
  serializeObjectToParams,
} from "@helpers/query-string-parameters/queryStringParameters";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { hasMany, hasOne } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { IParameterModel, ParameterModel } from "@models/data/parametersModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { AssociationInjector } from "@models/ImplementsInjector";
import { verificationStatusOptions } from "../annotation-search-form/annotationSearchParameters";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { filterAnd } from "@helpers/filters/filters";

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
  verificationStatus: jsString,
  taskBehavior: jsString,
  taskTag: jsNumber,
};

export class VerificationParameters
  extends ParameterModel<AudioEvent>(serializationTable)
  implements IVerificationParameters, IParameterModel<AudioEvent>
{
  public _taskBehavior: TaskBehaviorKey;
  public _verificationStatus: VerificationStatusKey = "unverified-for-me";
  public taskTag: Id<Tag>;
  public tags: Ids<Tag>;

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
    if (isInstantiated(this.taskTag)) {
      const uniqueIds = new Set([this.taskTag, ...(this.tags ?? [])]);
      return Array.from(uniqueIds);
    }

    return Array.from(this.tags ?? []);
  }

  public get taskBehavior(): TaskBehaviorKey {
    return this._taskBehavior;
  }

  public set taskBehavior(value: string) {
    if (this.isTaskBehaviorKey(value) || !isInstantiated(value)) {
      // So that we can minimize the number of query string parameters, we use
      // "verify" as the default if there is no "taskBehavior" query string
      // parameter.
      if (value === "verify") {
        this._taskBehavior = null;
      } else {
        this._taskBehavior = value;
      }
    } else {
      console.error(`Invalid select key: "${value}"`);
    }
  }

  public get verificationStatus(): VerificationStatusKey {
    return this._verificationStatus;
  }

  public set verificationStatus(value: string) {
    if (this.isVerificationStatusKey(value)) {
      this._verificationStatus = value;
    } else {
      console.error(`Invalid verification status: "${value}"`);
    }
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

  private isVerificationStatusKey(key: string): key is VerificationStatusKey {
    return verificationStatusOptions(this.user).has(key as any);
  }

  private isTaskBehaviorKey(key: string): key is TaskBehaviorKey {
    const validOptions: TaskBehaviorKey[] = [
      "verify-and-correct-tag",
      "verify",
    ];
    return validOptions.some((option) => option === key);
  }
}
