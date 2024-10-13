import { Injector } from "@angular/core";
import { Params } from "@angular/router";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import {
  AUDIO_RECORDING,
  PROJECT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { MonoTuple, Writeable } from "@helpers/advancedTypes";
import { filterDate, filterTime } from "@helpers/filters/audioEventFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
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
import { AbstractModel } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { IParameterModel } from "@models/data/parametersModel";
import { ImplementsInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTime, Duration } from "luxon";

export interface IAnnotationSearchParameters {
  audioRecordings: CollectionIds;
  projects: CollectionIds;
  regions: CollectionIds;
  sites: CollectionIds;
  tags: CollectionIds;
  onlyUnverified: boolean;
  daylightSavings: boolean,
  date: MonoTuple<DateTime, 2>;
  time: MonoTuple<Duration, 2>;
}

const serializationTable: IQueryStringParameterSpec<
  IAnnotationSearchParameters
> = {
  audioRecordings: jsNumberArray,
  projects: jsNumberArray,
  regions: jsNumberArray,
  sites: jsNumberArray,
  tags: jsNumberArray,
  onlyUnverified: jsBoolean,
  daylightSavings: jsBoolean,
  date: luxonDateArray,
  time: luxonDurationArray,
};

export class AnnotationSearchParameters
  implements
    IAnnotationSearchParameters,
    ImplementsInjector,
    IParameterModel<AudioEvent> {
  public constructor(
    protected queryStringParameters: Params = {},
    public injector?: Injector,
  ) {
    const deserializedObject: IAnnotationSearchParameters =
      deserializeParamsToObject<IAnnotationSearchParameters>(
        queryStringParameters,
        serializationTable,
      );

    const objectKeys = Object.keys(deserializedObject);
    for (const key of objectKeys) {
      this[key] = deserializedObject[key];
    }
  }

  public audioRecordings: CollectionIds;
  public projects: CollectionIds;
  public regions: CollectionIds;
  public sites: CollectionIds;
  public tags: CollectionIds;
  public onlyUnverified: boolean;
  public daylightSavings: boolean;
  public date: MonoTuple<DateTime, 2>;
  public time: MonoTuple<Duration, 2>;

  @hasMany<AnnotationSearchParameters, AudioRecording>(AUDIO_RECORDING, "audioRecordings")
  public audioRecordingModels?: AudioRecording[];
  @hasMany<AnnotationSearchParameters, Project>(PROJECT, "projects")
  public projectModels?: Project[];
  @hasMany<AnnotationSearchParameters, Region>(SHALLOW_REGION, "regions")
  public regionModels?: Region[];
  @hasMany<AnnotationSearchParameters, Site>(SHALLOW_SITE, "sites")
  public siteModels?: Site[];
  @hasMany<AnnotationSearchParameters, Tag>(TAG, "tags")
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
    const modelFilters = this.modelFilter();
    const tagFilters = filterModelIds<Tag>("tags", this.tags);
    const dateTimeFilters = this.dateTimeFilters(tagFilters);

    const filter = filterAnd<AudioEvent>(
      dateTimeFilters,
      filterAnd<AudioEvent>(modelFilters, tagFilters),
    );

    return { filter };
  }

  public toQueryParams(): Params {
    return serializeObjectToParams<IAnnotationSearchParameters>(
      this,
      serializationTable,
    );
  }

  private modelFilter(): InnerFilter<Writeable<AbstractModel>> {
    if (this.sites) {
      return filterModelIds("sites", this.sites);
    } else if (this.regions) {
      return filterModelIds("regions", this.regions);
    }

    return filterModelIds("projects", this.projects);
  }

  //! FOR PR REVIEWER: THIS IS WHERE I AM CURRENTLY UP TO
  private dateTimeFilters(initialFilter: InnerFilter<AudioEvent>): InnerFilter<AudioEvent> {
    const dateFilter = filterDate(initialFilter, this.dateStartedAfter, this.dateFinishedBefore);
    const dateTimeFilter = filterTime(dateFilter, this.daylightSavings, this.timeStartedAfter, this.timeFinishedBefore);
    return dateTimeFilter;
  }
}
