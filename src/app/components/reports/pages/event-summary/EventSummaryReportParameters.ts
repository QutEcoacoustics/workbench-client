import { Params } from "@angular/router";
import {
  AUDIO_EVENT_PROVENANCE,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { MonoTuple } from "@helpers/advancedTypes";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  IQueryStringParameterSpec,
  deserializeParamsToObject,
  serializeObjectToParams,
  jsNumberArray,
  jsNumber,
  jsString,
  jsBoolean,
  luxonDateArray,
  luxonDurationArray,
  jsStringArray,
} from "@helpers/query-string-parameters/queryStringParameters";
import { CollectionIds } from "@interfaces/apiInterfaces";
import { hasMany } from "@models/AssociationDecorators";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { AssociationInjector, HasAssociationInjector } from "@models/ImplementsInjector";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { IParameterModel } from "@models/data/parametersModel";
import { DateTime, Duration } from "luxon";

export enum Chart {
  speciesAccumulationCurve = "accumulation",
  speciesCompositionCurve = "composition",
  falseColorSpectrograms = "false-colour",
  none = "none",
}

export enum BucketSize {
  day = "day",
  week = "week",
  fortnight = "fortnight",
  month = "month",
  season = "season",
  year = "year",
}

export interface IEventSummaryReportParameters {
  sites: CollectionIds;
  points: CollectionIds;
  provenances: CollectionIds;
  tags: CollectionIds;
  score: number;
  bucketSize: BucketSize;
  daylightSavings: boolean;
  time: MonoTuple<Duration, 2>;
  date: MonoTuple<DateTime, 2>;
  charts: Chart[];
}

const serializationTable: IQueryStringParameterSpec = {
  sites: jsNumberArray,
  points: jsNumberArray,
  provenances: jsNumberArray,
  tags: jsNumberArray,
  score: jsNumber,
  bucketSize: jsString,
  daylightSavings: jsBoolean,
  date: luxonDateArray,
  time: luxonDurationArray,
  charts: jsStringArray,
};

export class EventSummaryReportParameters
  implements
    IEventSummaryReportParameters,
    HasAssociationInjector,
    IParameterModel<EventSummaryReport>
{
  public constructor(
    queryStringParameters: Params = {},
    public injector?: AssociationInjector
  ) {
    const deserializedObject: IEventSummaryReportParameters =
      deserializeParamsToObject<IEventSummaryReportParameters>(
        queryStringParameters,
        serializationTable
      );

    Object.keys(deserializedObject).forEach((key: string) => {
      this[key] = deserializedObject[key];
    });
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: CollectionIds;
  public points: CollectionIds;
  public provenances: CollectionIds;
  public tags: CollectionIds;
  public score: number;
  public bucketSize: BucketSize = BucketSize.month;
  public daylightSavings: boolean;
  public time: MonoTuple<Duration, 2>;
  public date: MonoTuple<DateTime, 2>;
  public charts: Chart[];

  @hasMany<EventSummaryReportParameters, Region>(SHALLOW_REGION, "sites")
  public regions?: Region[];
  @hasMany<EventSummaryReportParameters, Site>(SHALLOW_SITE, "points")
  public siteModels?: Site[];
  @hasMany<EventSummaryReportParameters, Tag>(TAG, "tags")
  public tagModels?: Tag[];
  @hasMany<EventSummaryReportParameters, AudioEventProvenance>(
    AUDIO_EVENT_PROVENANCE,
    "provenances"
  )
  public provenanceModels?: AudioEventProvenance[];

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

  public toFilter(): Filters<EventSummaryReport> {
    let filter: InnerFilter<EventSummaryReport>;

    if (this.sites) {
      filter = filterModelIds<EventSummaryReport>(
        "region",
        Array.from(this.sites),
        filter
      );
    }

    if (this.points) {
      filter = filterModelIds<EventSummaryReport>(
        "site",
        Array.from(this.points),
        filter
      );
    }

    if (this.provenances) {
      filter = filterModelIds<EventSummaryReport>(
        "provenance",
        Array.from(this.provenances),
        filter
      );
    }

    if (this.tags) {
      filter = filterModelIds<EventSummaryReport>(
        "tag",
        Array.from(this.tags),
        filter
      );
    }

    // we use isInstantiated() here because 0 is a valid value for score
    if (isInstantiated(this.score)) {
      filter = filterAnd<EventSummaryReport>(filter, {
        score: {
          gteq: this.score,
        },
      } as InnerFilter);
    }

    if (this.bucketSize) {
      filter = filterAnd(filter, {
        bucketSize: {
          eq: this.bucketSize,
        },
      } as InnerFilter);
    }

    if (this.dateStartedAfter || this.dateFinishedBefore) {
      filter = filterDate(
        filter,
        this.dateStartedAfter,
        this.dateFinishedBefore
      );
    }

    if (this.timeStartedAfter || this.timeFinishedBefore) {
      filter = filterTime(
        filter,
        this.daylightSavings,
        this.timeStartedAfter,
        this.timeFinishedBefore
      );
    }

    return { filter };
  }

  public toQueryParams(): Params {
    const queryParameters =
      serializeObjectToParams<IEventSummaryReportParameters>(
        this,
        serializationTable
      );

    return queryParameters;
  }
}
