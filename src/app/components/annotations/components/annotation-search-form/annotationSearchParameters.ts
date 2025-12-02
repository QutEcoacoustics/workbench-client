import { Params } from "@angular/router";
import { Filters, InnerFilter, Sorting } from "@baw-api/baw-api.service";
import {
  AUDIO_RECORDING,
  EVENT_IMPORT,
  PROJECT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG
} from "@baw-api/ServiceTokens";
import { MonoTuple } from "@helpers/advancedTypes";
import { filterEventRecordingDate } from "@helpers/filters/audioEventFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  IQueryStringParameterSpec,
  jsBoolean,
  jsNumber,
  jsNumberArray,
  jsString,
  luxonDateArray,
  luxonDurationArray,
  serializeObjectToParams,
  withDefault,
} from "@helpers/query-string-parameters/queryStringParameters";
import { CollectionIds, Id } from "@interfaces/apiInterfaces";
import { hasMany } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { AudioRecording } from "@models/AudioRecording";
import { IParameterModel, ParameterModel } from "@models/data/parametersModel";
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
import { VerificationStatusKey } from "../verification-form/verificationParameters";

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

export function verificationStatusOptions(user?: User) {
  return new Map([
    [
      "unverified-for-me",
      {
        or: [
          { "verifications.creatorId": { notEq: user?.id ?? null } },
          { "verifications.id": { eq: null } },
          {
            and: [
              { "verifications.creatorId": { eq: user?.id ?? null } },
              { "verifications.confirmed": { eq: "skip" } },
            ],
          },
        ],
      },
    ],
    [
      "unverified",
      {
        or: [
          { "verifications.confirmed": { eq: null } },
          { "verifications.confirmed": { eq: "skip" } },
        ],
      },
    ],
    ["any", null],
  ]) satisfies Map<VerificationStatusKey, InnerFilter<AudioEvent>>;
}

export interface IAnnotationSearchParameters {
  audioRecordings: CollectionIds<AudioRecording>;
  tags: CollectionIds<Tag>;
  daylightSavings: boolean;
  recordingDate: MonoTuple<DateTime, 2>;
  recordingTime: MonoTuple<Duration, 2>;
  score: MonoTuple<number, 2>;

  audioEventImports: CollectionIds<AudioEventImport>;
  importFiles: CollectionIds<AudioEventImportFile>;

  // these parameters are used to filter by project, region, and site in the
  // query string parameters
  // e.g. /annotations?projects=1,2,3&regions=4,5,6&sites=7,8,9
  projects: CollectionIds<Project>;
  regions: CollectionIds<Region>;
  sites: CollectionIds<Site>;

  // these parameters are used to filter by project, region, and site in the
  // route parameters
  // e.g. /projects/1/regions/2/sites
  // these exist in addition with the query string parameters to allow for
  // search parameters such as
  // /projects/1/regions/2?sites=3,4,5
  routeProjectId: Id<Project>;
  routeRegionId: Id<Region>;
  routeSiteId: Id<Site>;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  eventDate: MonoTuple<DateTime, 2>;
  eventTime: MonoTuple<Duration, 2>;

  sort: SortingKey;

  // These typings are imported from the VerificationSearchParameters so that
  // the same "verificationStatus" parameter can be used on for both annotation
  //search and the verification parameters.
  verificationStatus: VerificationStatusKey;
}

// we exclude project, region, and site from the serialization table because
// we do not want them emitted in the query string
const serializationTable: IQueryStringParameterSpec<IAnnotationSearchParameters> =
  {
    audioRecordings: jsNumberArray,
    tags: jsNumberArray,
    daylightSavings: jsBoolean,
    recordingDate: luxonDateArray,
    recordingTime: luxonDurationArray,
    score: jsNumberArray,

    audioEventImports: jsNumberArray,
    importFiles: jsNumberArray,

    // because the serialization of route parameters is handled by the angular
    // router, we only want to serialize the model filter query string parameters
    projects: jsNumberArray,
    regions: jsNumberArray,
    sites: jsNumberArray,

    sort: withDefault(jsString, "created-asc"),

    // Unlike the verification parameters, we want to show all audio events when
    // only using the annotation search parameters by default.
    verificationStatus: withDefault(jsString, "any"),
  };

const deserializationTable: IQueryStringParameterSpec<IAnnotationSearchParameters> =
  {
    ...serializationTable,

    routeProjectId: jsNumber,
    routeRegionId: jsNumber,
    routeSiteId: jsNumber,
  };

export class AnnotationSearchParameters
  extends ParameterModel<AudioEvent>(deserializationTable)
  implements
    IAnnotationSearchParameters,
    HasAssociationInjector,
    IParameterModel<AudioEvent>
{
  public audioRecordings: CollectionIds<AudioRecording>;
  public tags: CollectionIds<Tag>;
  public daylightSavings: boolean;
  public recordingDate: MonoTuple<DateTime, 2>;
  public recordingTime: MonoTuple<Duration, 2>;
  public score: MonoTuple<number, 2>;

  public audioEventImports: CollectionIds<AudioEventImport>;
  public importFiles: CollectionIds<AudioEventImportFile>;

  // These model ids are specified in the query string parameters.
  // If the query string parameters and route parameters conflict, the route
  // parameters will be used over these query string parameters.
  public projects: CollectionIds<Project>;
  public regions: CollectionIds<Region>;
  public sites: CollectionIds<Site>;

  public routeProjectId: Id<Project>;
  public routeRegionId: Id<Region>;
  public routeSiteId: Id<Site>;

  // TODO: this is a placeholder for future implementation once the api
  // supports filtering by event date time
  // https://github.com/QutEcoacoustics/baw-server/issues/687
  public eventDate: MonoTuple<DateTime, 2>;
  public eventTime: MonoTuple<Duration, 2>;

  public verificationStatus: VerificationStatusKey;
  public sort: SortingKey;

  public constructor(
    protected queryStringParameters: Params = {},
    public user?: User,
    public injector?: AssociationInjector,
  ) {
    super(queryStringParameters);
  }

  @hasMany(AUDIO_RECORDING, "audioRecordings")
  public audioRecordingModels?: AudioRecording[];
  @hasMany(PROJECT, "projects")
  public projectModels?: Project[];
  @hasMany(SHALLOW_REGION, "regions")
  public regionModels?: Region[];
  @hasMany(SHALLOW_SITE, "sites")
  public siteModels?: Site[];
  @hasMany(TAG, "tags")
  public tagModels?: Tag[];
  @hasMany(EVENT_IMPORT, "audioEventImports")
  public audioEventImportModels?: AudioEventImport[];
  // @hasMany(SHALLOW_EVENT_IMPORT_FILE, "importFiles", ["audioEventImports"])
  public importFileModels?: AudioEventImportFile[] = [];

  // TODO: use resolvers here once the association resolver decorators return a promise
  // see: https://github.com/QutEcoacoustics/workbench-client/issues/2148
  // @hasOne(PROJECT, "routeProjectId")
  public routeProjectModel?: Project;
  // @hasOne(SHALLOW_REGION, "routeRegionId")
  public routeRegionModel?: Region;
  // @hasOne(SHALLOW_SITE, "routeSiteId")
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

  public toQueryParams({ includeVerification = true } = {}): Params {
    const params = serializeObjectToParams<IAnnotationSearchParameters>(
      this,
      serializationTable,
    );

    if (!includeVerification) {
      delete params["verificationStatus"];
    }

    return params;
  }

  public toFilter({ includeVerification = true } = {}): Filters<AudioEvent> {
    let filter = this.tagFilters();
    filter = this.addRecordingFilters(filter);
    filter = this.annotationImportFilters(filter);
    filter = this.addRouteFilters(filter);
    filter = this.addEventFilters(filter);

    if (includeVerification) {
      filter = this.addVerificationFilters(filter);
    }

    // If the "sort" query string parameter is not set, this.sortingFilters()
    // will return undefined.
    const sorting = this.sortingFilters();
    if (sorting === undefined) {
      return { filter };
    }

    return { filter, sorting };
  }

  private siteIds(): Id<Site>[] {
    if (isInstantiated(this.routeSiteId)) {
      return [this.routeSiteId];
    }

    return this.sites ? Array.from(this.sites) : [];
  }

  private regionIds(): Id<Region>[] {
    if (isInstantiated(this.routeRegionId)) {
      return [this.routeRegionId];
    }

    return this.regions ? Array.from(this.regions) : [];
  }

  private projectIds(): Id<Project>[] {
    if (isInstantiated(this.routeProjectId)) {
      return [this.routeProjectId];
    }

    return this.projects ? Array.from(this.projects) : [];
  }

  private routeFilters(): InnerFilter<AudioEvent> {
    const modelSiteIds = this.siteIds();
    if (modelSiteIds.length > 0) {
      return {
        "sites.id": {
          in: modelSiteIds,
        },
      } as InnerFilter<AudioEvent>;
    }

    const modelRegionIds = this.regionIds();
    if (modelRegionIds.length > 0) {
      return {
        "regions.id": {
          in: modelRegionIds,
        },
      } as InnerFilter<AudioEvent>;
    }

    const modelProjectIds = this.projectIds();
    if (modelProjectIds.length > 0) {
      return {
        "projects.id": {
          in: modelProjectIds,
        },
      } as InnerFilter<AudioEvent>;
    }

    return {};
  }

  private addRouteFilters(
    initialFilter: InnerFilter<AudioEvent>,
  ): InnerFilter<AudioEvent> {
    return filterAnd(initialFilter, this.routeFilters());
  }

  private tagFilters(): InnerFilter<AudioEvent> {
    if (!isInstantiated(this.tags) || Array.from(this.tags).length === 0) {
      return {};
    }

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

    if (
      !isInstantiated(this.audioRecordings) ||
      Array.from(this.audioRecordings).length === 0
    ) {
      return dateFilter;
    }

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
    // Annotation imports and annotation import file filters are mutually
    // exclusive because an annotation import file will always be a part of an
    // exiting annotation import.
    // This means that we can exclude the annotation import filter conditions if
    // there are also annotation import file filters.
    if (
      isInstantiated(this.importFiles) &&
      Array.from(this.importFiles).length !== 0
    ) {
      const importFileFilters = {
        audioEventImportFileId: {
          in: Array.from(this.importFiles),
        },
      };

      return filterAnd(initialFilter, importFileFilters);
    } else if (
      isInstantiated(this.audioEventImports) &&
      Array.from(this.audioEventImports).length !== 0
    ) {
      const importFilters = {
        "audioEventImports.id": {
          in: Array.from(this.audioEventImports),
        },
      } as any;

      return filterAnd(initialFilter, importFilters);
    }

    return initialFilter;
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
    const defaultVerificationStatus = "any" satisfies VerificationStatusKey;

    let statusKey = this.verificationStatus;
    if (!this.isVerificationStatusKey(statusKey)) {
      console.warn(
        `Invalid verification status key provided: '${statusKey}'. Falling back to '${defaultVerificationStatus}'.`,
      );
      statusKey = defaultVerificationStatus;
    }

    const filters = verificationStatusOptions(this.user).get(statusKey);

    return filterAnd(initialFilter, filters);
  }

  private isVerificationStatusKey(key: string): key is VerificationStatusKey {
    return verificationStatusOptions(this.user).has(key as any);
  }

  private sortingFilters(): Sorting<keyof AudioEvent> | undefined {
    const defaultSortKey = "created-asc" satisfies SortingKey;

    let sortingKey = this.sort;
    if (!this.isSortingKey(sortingKey)) {
      console.warn(
        `Invalid sorting key provided: '${this.sort}'. Falling back to '${defaultSortKey}'.`,
      );
      sortingKey = defaultSortKey;
    }

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
}
