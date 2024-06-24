import { Injector } from "@angular/core";
import { Params } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { PROJECT, SHALLOW_REGION, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
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
import { hasMany } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { IParameterModel } from "@models/data/parametersModel";
import { ImplementsInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
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

  @hasMany<VerificationParameters, Project>(PROJECT, "projects")
  public projectModels?: Project[];
  @hasMany<VerificationParameters, Region>(SHALLOW_REGION, "regions")
  public regionModels?: Region[];
  @hasMany<VerificationParameters, Site>(SHALLOW_SITE, "sites")
  public siteModels?: Site[];
  @hasMany<VerificationParameters, Tag>(TAG, "tags")
  public tagModels?: Tag[];

  public get dateStartedAfter(): DateTime | null {
    return this.date ? this.date[0] : null;
  }

  public get dateFinishedBefore(): DateTime | null {
    return this.date ? this.date[1] : null;
  }

  public get timeStartedAfter(): Duration | null {
    return this.time ? this.time[0] : null;
  }

  public get timeFinishedBefore(): Duration | null {
    return this.time ? this.time[1] : null;
  }

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
