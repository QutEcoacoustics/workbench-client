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
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
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
import { hasMany, hasOne } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { IParameterModel } from "@models/data/parametersModel";
import {
  AssociationInjector,
  HasAssociationInjector,
} from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { DateTime, Duration } from "luxon";

export type SortingKey =
  | "score-asc"
  | "score-desc"
  | "created-asc"
  | "created-desc";

// prettier-ignore
export const sortingOptions = new Map([
  ["score-asc", {
    orderBy: "score",
    direction: "asc",
  }],
  ["score-desc", {
    orderBy: "score",
    direction: "desc",
  }],
  ["created-asc", {
    orderBy: "createdAt",
    direction: "asc",
  }],
  ["created-desc", {
    orderBy: "createdAt",
    direction: "desc",
  }],
]) satisfies Map<SortingKey, Sorting<keyof AudioEvent>>;

// The verification status options map can be found in the
// AnnotationSearchParameter's getters.
// I have to use a getter because some of the filter conditions depend on the
// session state.
export type VerificationStatusKey = "unverified-for-me" | "unverified" | "any";

export type TaskBehaviorKey = "verify-and-correct-tag" | "verify";

export interface IAnnotationSearchParameters {
  audioRecordings: CollectionIds;
  tags: CollectionIds;
  importFiles: CollectionIds;
  daylightSavings: boolean;
  recordingDate: MonoTuple<DateTime, 2>;
  recordingTime: MonoTuple<Duration, 2>;
  score: MonoTuple<number, 2>;

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

  sort: SortingKey;
  taskTag: Id;
  verificationStatus: VerificationStatusKey;
  taskBehavior: TaskBehaviorKey;
}

// we exclude project, region, and site from the serialization table because
// we do not want them emitted in the query string
const serializationTable: IQueryStringParameterSpec<
  Partial<IAnnotationSearchParameters>
> = {
  audioRecordings: jsNumberArray,
  tags: jsNumberArray,
  importFiles: jsNumberArray,
  daylightSavings: jsBoolean,
  recordingDate: luxonDateArray,
  recordingTime: luxonDurationArray,
  score: jsNumberArray,

  // because the serialization of route parameters is handled by the angular
  // router, we only want to serialize the model filter query string parameters
  projects: jsNumberArray,
  regions: jsNumberArray,
  sites: jsNumberArray,

  sort: jsString,
  taskTag: jsNumber,
  verificationStatus: jsString,
  taskBehavior: jsString,
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
    public user?: User,
    public injector?: AssociationInjector,
  ) {
    const deserializedObject: IAnnotationSearchParameters =
      deserializeParamsToObject<IAnnotationSearchParameters>(
        queryStringParameters,
        deserializationTable,
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
  public importFiles: CollectionIds;
  public daylightSavings: boolean;
  public recordingDate: MonoTuple<DateTime, 2>;
  public recordingTime: MonoTuple<Duration, 2>;
  public score: MonoTuple<number, 2>;

  // These model ids are specified in the query string parameters.
  // If the query string parameters and route parameters conflict, the route
  // parameters will be used over these query string parameters.
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

  public taskTag: Id;

  private _sort: SortingKey;
  private _verificationStatus: VerificationStatusKey;
  private _taskBehavior: TaskBehaviorKey;

  public get sort(): SortingKey {
    return this._sort;
  }

  /**
   * A getter/setter pair that will reject incorrect sorting values.
   * This setter can soft reject by logging an error and not updating the
   * underlying value.
   */
  public set sort(value: string) {
    // We have a !isInstantiated condition here so that the sorting value can be
    // explicitly nullified/removed after creation.
    if (this.isSortingKey(value) || !isInstantiated(value)) {
      // So that we can minimize the number of query string parameters, we use
      // upload-date-asc as the default if there is no "sort" query string
      // parameter.
      if (value === "created-asc") {
        this._sort = null;
      } else {
        this._sort = value;
      }
    } else {
      console.error(`Invalid sorting key: "${value}"`);
    }
  }

  public get verificationStatus(): VerificationStatusKey {
    return this._verificationStatus;
  }

  public set verificationStatus(value: string) {
    if (this.isVerificationStatusKey(value) || !isInstantiated(value)) {
      // So that we can minimize the number of query string parameters, we use
      // "unverified-for-me" as the default if there is no "sort" query string parameter.
      if (value === "unverified-for-me") {
        this._verificationStatus = null;
      } else {
        this._verificationStatus = value;
      }
    } else {
      console.error(`Invalid select key: "${value}"`);
    }
  }

  public get tagPriority(): Id[] {
    if (isInstantiated(this.taskTag)) {
      const uniqueIds = new Set([this.taskTag, ...this.tags ?? []]);
      return Array.from(uniqueIds);
    }

    return Array.from(this.tags ?? []);
  }

  @hasOne<AnnotationSearchParameters, Tag>(TAG, "taskTag")
  public taskTagModel?: Tag;

  public get taskBehavior(): TaskBehaviorKey {
    return this._taskBehavior;
  }

  public set taskBehavior(value: string) {
    if (this.isTaskBehaviorKey(value) || !isInstantiated(value)) {
      // So that we can minimize the number of query string parameters, we use
      // "unverified-for-me" as the default if there is no "taskBehavior" query
      // string parameter.
      if (value === "verify") {
        this._taskBehavior = null;
      } else {
        this._taskBehavior = value;
      }
    } else {
      console.error(`Invalid select key: "${value}"`);
    }
  }

  @hasMany<AnnotationSearchParameters, AudioRecording>(
    AUDIO_RECORDING,
    "audioRecordings",
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

  public get scoreLowerBound(): number | null {
    return this.score ? this.score[0] : null;
  }

  public get scoreUpperBound(): number | null {
    return this.score ? this.score[1] : null;
  }

  private get verificationStatusOptions() {
    return new Map([
      ["unverified-for-me", {
        or: [
          { "verifications.creatorId": { notEq: this.user?.id ?? null } },
          { "verifications.id": { eq: null } },
          {
            and: [
              { "verifications.creatorId": { eq: this.user?.id ?? null } },
              { "verifications.confirmed": { eq: "skip" } },
            ],
          },
        ],
      }],
      ["unverified", {
        or: [
          { "verifications.confirmed": { eq: null } },
          { "verifications.confirmed": { eq: "skip" } },
        ],
      }],
      ["any", null],
    ]) satisfies Map<VerificationStatusKey, InnerFilter<AudioEvent>>;
  }

  // TODO: fix up this function
  public toFilter(): Filters<AudioEvent> {
    let filter = this.tagFilters();
    filter = this.addRecordingFilters(filter);
    filter = this.annotationImportFilters(filter);
    filter = this.addRouteFilters(filter);
    filter = this.addEventFilters(filter);
    filter = this.addVerificationFilters(filter);

    // If the "sort" query string parameter is not set, this.sortingFilters()
    // will return undefined.
    const sorting = this.sortingFilters();
    if (sorting === undefined) {
      return { filter };
    }

    return { filter, sorting };
  }

  public toQueryParams(): Params {
    return serializeObjectToParams<IAnnotationSearchParameters>(
      this,
      serializationTable,
    );
  }

  private routeFilters(): InnerFilter<AudioEvent> {
    // because this filter is constructed for audio events, but the project
    // model is associated with the audio recording model, we need to do a
    // association of an association filter
    // e.g. audioRecordings.projects.id: { in: [1, 2, 3] }
    // however, the api doesn't currently support this functionality
    // therefore, we do a virtual join by filtering on the project/region site
    // ids on the client.
    const modelSiteIds = this.siteIds();

    return {
      "audioRecordings.siteId": {
        in: modelSiteIds,
      },
    } as InnerFilter<AudioEvent>;
  }

  // This method gets all of the models in the route and query string
  // parameters, and extracts their site ids.
  // This is needed because the API doesn't support filtering audio events by
  // projects or regions.
  //
  // This method will return the most specific list of site ids from the route
  // and query string parameter models
  //
  // TODO: remove this method once the API supports filtering audio events by
  // projects, and regions.
  // see: https://github.com/QutEcoacoustics/baw-server/issues/687
  private siteIds(): Id[] {
    const qspSites = this.sites ? Array.from(this.sites) : [];

    // We use a !== null condition here instead of a truthy assertion so that
    // a route site if of 0 also passes this condition.
    if (isInstantiated(this.routeSiteId)) {
      return [this.routeSiteId];
    } else if (qspSites.length > 0) {
      return qspSites;
    }

    // If there are no route or qsp site models, the next most specific level
    // is the region level.
    const qspRegions = this.regions ? Array.from(this.regions) : [];

    if (isInstantiated(this.routeRegionId)) {
      return Array.from(this.routeRegionModel.siteIds);
    } else if (qspRegions.length > 0) {
      return qspRegions;
    }

    const qspProjects = this.projects ? Array.from(this.projects) : [];

    if (isInstantiated(this.routeProjectId)) {
      return Array.from(this.routeProjectModel.siteIds);
    } else if (qspProjects.length > 0) {
      return qspProjects;
    }

    // This condition should never hit in regular use.
    // We return an empty array here instead of throwing an error in the hope
    // that the application can recover instead of crashing all work.
    console.error("Failed to find any scoped route or qsps models");
    return [];
  }

  private addRouteFilters(
    initialFilter: InnerFilter<AudioEvent>,
  ): InnerFilter<AudioEvent> {
    return filterAnd(initialFilter, this.routeFilters());
  }

  private tagFilters(): InnerFilter<AudioEvent> {
    const tagFilters = filterModelIds<Tag>("tags", this.tags);
    return tagFilters;
  }

  private addRecordingFilters(
    initialFilter: InnerFilter<AudioEvent>,
  ): InnerFilter<AudioEvent> {
    const dateFilter = filterEventRecordingDate(
      initialFilter,
      this.recordingDateStartedAfter,
      this.recordingDateFinishedBefore,
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

    const recordingFilter = filterModelIds(
      "audioRecordings",
      this.audioRecordings,
      dateFilter,
    );

    return recordingFilter;
  }

  private annotationImportFilters(
    initialFilter: InnerFilter<AudioEvent>,
  ): InnerFilter<AudioEvent> {
    if (!isInstantiated(this.importFiles)) {
      return initialFilter;
    }

    const importFileFilters = {
      audioEventImportFileId: {
        in: Array.from(this.importFiles),
      },
    };

    return filterAnd(initialFilter, importFileFilters);
  }

  // TODO: We should add support for event date/time filtering once the api
  // adds supports.
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  private addEventFilters(
    initialFilter: InnerFilter<AudioEvent>,
  ): InnerFilter<AudioEvent> {
    // I purposely use a falsy condition here.
    // Because this falsy condition will match against a score of zero, this
    // method will short circuit and return the initial filter if the score is
    // zero, undefined, or null.
    if (!isInstantiated(this.score)) {
      return initialFilter;
    }

    const lowerBound = this.score[0];
    const upperBound = this.score[1];

    let scoreFilters: InnerFilter<AudioEvent> = initialFilter;
    if (isInstantiated(lowerBound)) {
      scoreFilters = filterAnd(scoreFilters, {
        score: { gteq: lowerBound },
      });
    }

    if (isInstantiated(upperBound)) {
      scoreFilters = filterAnd(scoreFilters, {
        score: { lteq: upperBound },
      });
    }

    return scoreFilters;
  }

  private addVerificationFilters(initialFilter: InnerFilter<AudioEvent>) {
    const defaultKey = "unverified-for-me" satisfies VerificationStatusKey;
    const statusKey = this.isVerificationStatusKey(this.verificationStatus)
      ? this.verificationStatus
      : defaultKey;

    const filters = this.verificationStatusOptions.get(statusKey);

    return filterAnd(initialFilter, filters);
  }

  private sortingFilters(): Sorting<keyof AudioEvent> | undefined {
    const defaultSortKey = "created-asc" satisfies SortingKey;
    const sortingKey = this.isSortingKey(this.sort)
      ? this.sort
      : defaultSortKey;

    // If the sortingKey does not exist in the sortingOptions, this function
    // will return "undefined".
    // This same logic applies to if the sortingKey is "null" indicating that
    // the "sort" query string parameter is not set.
    return sortingOptions.get(sortingKey);
  }

  /**
   * A type guard that can be used to narrow the typing of a user provided
   * "sort" query string parameter.
   */
  private isSortingKey(key: string): key is SortingKey {
    // We use "has" instead of "in" here because we don't want to return
    // "true" if the key is in the prototype chain.
    // E.g. If we used the "in" operator here, a sorting key of hasOwnProperty
    // would return true, and would attempt to serialize a function when
    // creating the filter request body.
    return sortingOptions.has(key as any);
  }

  private isVerificationStatusKey(key: string): key is VerificationStatusKey {
    return this.verificationStatusOptions.has(key as any);
  }

  private isTaskBehaviorKey(key: string): key is TaskBehaviorKey {
    const validOptions: TaskBehaviorKey[] = ["verify-and-correct-tag", "verify"];
    return validOptions.some((option) => option === key);
  }
}
