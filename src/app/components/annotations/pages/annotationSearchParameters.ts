import { Params } from "@angular/router";
import { Filters, InnerFilter, Sorting } from "@baw-api/baw-api.service";
import {
  AUDIO_RECORDING,
  PROJECT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { MonoTuple } from "@helpers/advancedTypes";
import { filterEventRecordingDate } from "@helpers/filters/audioEventFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import {
  deserializeParamsToObject,
  IQueryStringParameterSpec,
  jsBoolean,
  jsNumber,
  jsNumberArray,
  jsString,
  luxonDateArray,
  luxonDurationArray,
  serializeObjectToParams,
} from "@helpers/query-string-parameters/queryStringParameters";
import { CollectionIds, Id } from "@interfaces/apiInterfaces";
import { AbstractData } from "@models/AbstractData";
import { hasMany } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { IParameterModel } from "@models/data/parametersModel";
import { AssociationInjector, HasAssociationInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTime, Duration } from "luxon";

export type SortingKey = string;

export const sortByOptions = {
  "score-asc": {
    orderBy: "score",
    direction: "asc",
  },
  "score-desc": {
    orderBy: "score",
    direction: "desc",
  },
  "upload-date-asc": {
    orderBy: "createdAt",
    direction: "asc",
  },
  "upload-date-desc": {
    orderBy: "createdAt",
    direction: "desc",
  },
} as const satisfies Record<string, Sorting<keyof AudioEvent>>;

export interface IAnnotationSearchParameters {
  audioRecordings: CollectionIds;
  tags: CollectionIds;
  onlyUnverified: boolean;
  daylightSavings: boolean;
  recordingDate: MonoTuple<DateTime, 2>;
  recordingTime: MonoTuple<Duration, 2>;

  // these parameters are used to filter by project, region, and site in the
  // query string parameters
  // e.g. /annotations?projects=1,2,3&regions=4,5,6&sites=7,8,9
  projects: CollectionIds;
  regions: CollectionIds;
  sites: CollectionIds;

  // these parameters are used to filter by project, region, and site in the
  // route parameters
  // e.g. /projects/1/regions/2/sites
  // these exist in addition with the query string parameters to allow for
  // search parameters such as
  // /projects/1/regions/2?sites=3,4,5
  routeProjectId: Id;
  routeRegionId: Id;
  routeSiteId: Id;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  eventDate: MonoTuple<DateTime, 2>;
  eventTime: MonoTuple<Duration, 2>;

  sortBy: SortingKey;
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

  // because the serialization of route parameters is handled by the angular
  // router, we only want to serialize the model filter query string parameters
  projects: jsNumberArray,
  regions: jsNumberArray,
  sites: jsNumberArray,

  sortBy: jsString,
};

const deserializationTable: IQueryStringParameterSpec<
  Partial<IAnnotationSearchParameters>
> = {
  ...serializationTable,

  routeProjectId: jsNumber,
  routeRegionId: jsNumber,
  routeSiteId: jsNumber,
};

export class AnnotationSearchParameters
  extends AbstractData
  implements
    IAnnotationSearchParameters,
    HasAssociationInjector,
    IParameterModel<AudioEvent>
{
  public constructor(
    protected queryStringParameters: Params = {},
    public injector?: AssociationInjector
  ) {
    const deserializedObject: IAnnotationSearchParameters =
      deserializeParamsToObject<IAnnotationSearchParameters>(
        queryStringParameters,
        deserializationTable
      );

    const objectData = {};
    const objectKeys = Object.keys(deserializedObject);
    for (const key of objectKeys) {
      objectData[key] = deserializedObject[key];
    }

    super(objectData);
  }

  public audioRecordings: CollectionIds;
  public tags: CollectionIds;
  public onlyUnverified: boolean;
  public daylightSavings: boolean;
  public recordingDate: MonoTuple<DateTime, 2>;
  public recordingTime: MonoTuple<Duration, 2>;

  public projects: CollectionIds;
  public regions: CollectionIds;
  public sites: CollectionIds;

  public routeProjectId: Id;
  public routeRegionId: Id;
  public routeSiteId: Id;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  public eventDate: MonoTuple<DateTime, 2>;
  public eventTime: MonoTuple<Duration, 2>;

  public sortBy: SortingKey;

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

  // TODO: use resolvers here once the association resolver decorators return a promise
  // see: https://github.com/QutEcoacoustics/workbench-client/issues/2148
  // @hasOne<AnnotationSearchParameters, Project>(PROJECT, "routeProjectId")
  public routeProjectModel?: Project;
  // @hasOne<AnnotationSearchParameters, Region>(SHALLOW_REGION, "routeRegionId")
  public routeRegionModel?: Region;
  // @hasOne<AnnotationSearchParameters, Site>(SHALLOW_SITE, "routeSiteId")
  public routeSiteModel?: Site;

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

  // TODO: fix up this function
  public toFilter(): Filters<AudioEvent> {
    const tagFilters = filterModelIds<Tag>("tags", this.tags);
    const dateTimeFilters = this.recordingDateTimeFilters(tagFilters);
    const siteFilters = filterAnd(dateTimeFilters, this.routeFilters());
    const filter = this.eventDateTimeFilters(siteFilters);

    const sorting = this.sortingFilters();
    if (sorting === undefined) {
      return { filter };
    }

    return { filter, sorting };
  }

  public toQueryParams(): Params {
    return serializeObjectToParams<IAnnotationSearchParameters>(
      this,
      serializationTable
    );
  }

  public modelFilters(): InnerFilter<Project | Region | Site> {
    if (this.siteModels.length > 0) {
      return filterModelIds("sites", this.sites);
    } else if (this.regionModels.length > 0) {
      return filterModelIds("regions", this.regions);
    } else {
      return filterModelIds("projects", this.projects);
    }
  }

  private routeFilters(): InnerFilter<AudioEvent> {
    let siteIds: number[] = [];

    // because this filter is constructed for audio events, but the project
    // model is associated with the audio recording model, we need to do a
    // association of an association filter
    // e.g. audioRecordings.projects.id: { in: [1, 2, 3] }
    // however, the api doesn't currently support this functionality
    // therefore, we do a virtual join by filtering on the project/region site
    // ids on the client.
    //
    // Note that we use a !== undefined assertion here (instead of a truthy
    // assertion) so that a site/region id of 0 is still passes this condition.
    if (this.routeSiteId) {
      siteIds = [this.routeSiteId];
    } else if (this.routeRegionId ) {
      siteIds = Array.from(this.routeRegionModel.siteIds);
    } else {
      siteIds = Array.from(this.routeProjectModel.siteIds);
    }

    return {
      "audioRecordings.siteId": {
        in: siteIds,
      },
    } as InnerFilter<AudioEvent>;
  }

  private recordingDateTimeFilters(
    initialFilter: InnerFilter<AudioEvent>
  ): InnerFilter<AudioEvent> {
    const dateFilter = filterEventRecordingDate(
      initialFilter,
      this.recordingDateStartedAfter,
      this.recordingDateFinishedBefore
    );

    // time filtering is currently disabled until we can filter on custom fields
    // and association
    // see https://github.com/QutEcoacoustics/baw-server/issues/689
    // TODO: enable time filtering once the api adds support
    //
    // const dateTimeFilter = filterTime(
    //   dateFilter,
    //   this.daylightSavings,
    //   this.recordingTimeStartedAfter,
    //   this.recordingTimeFinishedBefore
    // );

    return dateFilter;
  }

  // TODO: this function is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  private eventDateTimeFilters(
    initialFilter: InnerFilter<AudioEvent>
  ): InnerFilter<AudioEvent> {
    return initialFilter;
  }

  private sortingFilters(): Sorting<keyof AudioEvent> {
    const defaultSortKey = "upload-date-asc";
    const sortKey = this.sortBy in sortByOptions
      ? this.sortBy
      : defaultSortKey;

    return sortByOptions[sortKey];
  }
}
