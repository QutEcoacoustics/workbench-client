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
import { MonoTuple } from "@helpers/advancedTypes";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterModelIds } from "@helpers/filters/filters";
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
import { AbstractData } from "@models/AbstractData";
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
  daylightSavings: boolean;
  recordingDate: MonoTuple<DateTime, 2>;
  recordingTime: MonoTuple<Duration, 2>;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  eventDate: MonoTuple<DateTime, 2>;
  eventTime: MonoTuple<Duration, 2>;
}

// we exclude project, region, and site from the serialization table because
// we do not want them emitted in the query string
const serializationTable: IQueryStringParameterSpec<
  Partial<IAnnotationSearchParameters>
> = {
  audioRecordings: jsNumberArray,
  tags: jsNumberArray,
  onlyUnverified: jsBoolean,
  daylightSavings: jsBoolean,
  recordingDate: luxonDateArray,
  recordingTime: luxonDurationArray,
};

export class AnnotationSearchParameters
  extends AbstractData
  implements
    IAnnotationSearchParameters,
    ImplementsInjector,
    IParameterModel<AudioEvent>
{
  public constructor(
    protected queryStringParameters: Params = {},
    public injector?: Injector
  ) {
    const deserializedObject: IAnnotationSearchParameters =
      deserializeParamsToObject<IAnnotationSearchParameters>(
        queryStringParameters,
        serializationTable
      );

    const objectData = {};
    const objectKeys = Object.keys(deserializedObject);
    for (const key of objectKeys) {
      objectData[key] = deserializedObject[key];
    }

    super(objectData);
  }

  public audioRecordings: CollectionIds;
  public projects: CollectionIds;
  public regions: CollectionIds;
  public sites: CollectionIds;
  public tags: CollectionIds;
  public onlyUnverified: boolean;
  public daylightSavings: boolean;
  public recordingDate: MonoTuple<DateTime, 2>;
  public recordingTime: MonoTuple<Duration, 2>;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  public eventDate: MonoTuple<DateTime, 2>;
  public eventTime: MonoTuple<Duration, 2>;

  @hasMany<AnnotationSearchParameters, AudioRecording>(
    AUDIO_RECORDING,
    "audioRecordings"
  )
  public audioRecordingModels?: AudioRecording[];
  @hasMany<AnnotationSearchParameters, Project>(PROJECT, "projects")
  public projectModels?: Project[];
  @hasMany<AnnotationSearchParameters, Region>(SHALLOW_REGION, "regions")
  public regionModels?: Region[];
  @hasMany<AnnotationSearchParameters, Site>(SHALLOW_SITE, "sites")
  public siteModels?: Site[];
  @hasMany<AnnotationSearchParameters, Tag>(TAG, "tags")
  public tagModels?: Tag[];

  public get recordingDateStartedAfter(): DateTime | null {
    return this.recordingDate ? this.recordingDate[0] : null;
  }

  public get recordingDateFinishedBefore(): DateTime | null {
    return this.recordingDate ? this.recordingDate[1] : null;
  }

  public get recordingTimeStartedAfter(): Duration | null {
    return this.recordingTime ? this.recordingTime[0] : null;
  }

  public get recordingTimeFinishedBefore(): Duration | null {
    return this.recordingTime ? this.recordingTime[1] : null;
  }

  public toFilter(): Filters<AudioEvent> {
    const tagFilters = filterModelIds<Tag>("tags", this.tags);
    const recordingDateTimeFilters = this.recordingDateTimeFilters(tagFilters);
    const filter = this.eventDateTimeFilters(recordingDateTimeFilters);
    return { filter };
  }

  public toQueryParams(): Params {
    return serializeObjectToParams<IAnnotationSearchParameters>(
      this,
      serializationTable
    );
  }

  private recordingDateTimeFilters(
    initialFilter: InnerFilter<AudioEvent>
  ): InnerFilter<AudioEvent> {
    const dateFilter = filterDate(
      initialFilter,
      this.recordingDateStartedAfter,
      this.recordingDateFinishedBefore
    );
    const dateTimeFilter = filterTime(
      dateFilter,
      this.daylightSavings,
      this.recordingTimeStartedAfter,
      this.recordingTimeFinishedBefore
    );
    return dateTimeFilter;
  }

  // TODO: this function is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  private eventDateTimeFilters(
    initialFilter: InnerFilter<AudioEvent>
  ): InnerFilter<AudioEvent> {
    return initialFilter;
  }
}
