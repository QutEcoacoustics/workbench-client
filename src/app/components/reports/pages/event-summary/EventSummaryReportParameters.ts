import { Params } from "@angular/router";
import {
  AUDIO_EVENT_PROVENANCE,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { IsomorphicTuple } from "@helpers/advancedTypes";
import {
  filterEventDate,
  filterEventTime,
} from "@helpers/filters/audioEventFilters";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  IQueryStringParameterSpec,
  jsBoolean,
  jsNumber,
  jsNumberArray,
  jsString,
  jsStringArray,
  luxonDateArray,
  luxonDurationArray,
  serializeObjectToParams,
} from "@helpers/query-string-parameters/queryStringParameters";
import { CollectionIds } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";

import {
  AssociationInjector,
  HasAssociationInjector,
} from "@models/ImplementsInjector";
import { Provenance } from "@models/Provenance";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { IParameterModel, ParameterModel } from "@models/data/parametersModel";
import { DateTime, Duration } from "luxon";

export enum Chart {
  coverage = "coverage",
  eventSummary = "event-summary",
  speciesAccumulationCurve = "accumulation",
  speciesCompositionCurve = "composition",
  speciesTimeSeries = "time-series",
  none = "none",
}

export enum BucketSize {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface IEventSummaryReportParameters {
  regions: CollectionIds;
  sites: CollectionIds;
  provenances: CollectionIds;
  tags: CollectionIds;
  score: number;
  bucketSize: BucketSize;
  daylightSavings: boolean;
  time: IsomorphicTuple<Duration | null, 2> | null;
  date: IsomorphicTuple<DateTime | null, 2> | null;
  charts: Chart[];
}

const serializationTable: IQueryStringParameterSpec = {
  regions: jsNumberArray,
  sites: jsNumberArray,
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
  extends ParameterModel<AudioEvent>(serializationTable)
  implements
    IEventSummaryReportParameters,
    HasAssociationInjector,
    IParameterModel<AudioEvent>
{
  public constructor(
    queryStringParameters: Params = {},
    public injector?: AssociationInjector,
  ) {
    super(queryStringParameters);

    // field initializers would overwrite values assigned by the base
    // constructor (useDefineForClassFields is false), so default here instead
    this.bucketSize ??= BucketSize.month;
    this.time ??= null;
    this.date ??= null;
  }

  public regions!: CollectionIds;
  public sites!: CollectionIds;
  public provenances!: CollectionIds;
  public tags!: CollectionIds;
  public score!: number;
  public bucketSize!: BucketSize;
  public daylightSavings!: boolean;
  public time!: IsomorphicTuple<Duration | null, 2> | null;
  public date!: IsomorphicTuple<DateTime | null, 2> | null;
  public charts!: Chart[];

  @hasMany<EventSummaryReportParameters, Region>(SHALLOW_REGION, "regions")
  public regionModels?: Region[];
  @hasMany<EventSummaryReportParameters, Site>(SHALLOW_SITE, "sites")
  public siteModels?: Site[];
  @hasMany<EventSummaryReportParameters, Tag>(TAG, "tags")
  public tagModels?: Tag[];
  @hasMany<EventSummaryReportParameters, Provenance>(
    AUDIO_EVENT_PROVENANCE,
    "provenances",
  )
  public provenanceModels?: Provenance[];

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
    return this.toAudioEventFilter();
  }

  public toAudioEventFilter(): Filters<AudioEvent> {
    let filter = this.buildScopedFilter<AudioEvent>();

    if (this.provenances) {
      filter = filterModelIds<AudioEvent>(
        "provenance",
        Array.from(this.provenances),
        filter!,
      );
    }

    if (this.tags) {
      filter = filterModelIds<AudioEvent>(
        "tag",
        Array.from(this.tags),
        filter!,
      );
    }

    // we use isInstantiated() here because 0 is a valid value for score
    if (isInstantiated(this.score)) {
      filter = filterAnd<AudioEvent>(filter!, {
        score: {
          gteq: this.score,
        },
      } as InnerFilter<AudioEvent>);
    }

    return {
      filter: this.applyDateAndTimeFilters(filter, AudioEvent),
      options: { bucketSize: this.bucketSize },
    };
  }

  //! TODO: this is a terrible way to solve this problem.
  // we need better association injection that don't depend on AbstractModelWithoutId
  // and we need the server to support generic fully-qualified fields so the same
  // filter expression can be used for both AudioEvent and AudioRecording.
  // This is a temporary solution to get the report working.
  public toAudioRecordingFilter(): Filters<AudioRecording> {
    const filter = this.buildScopedFilter<AudioRecording>();
    return { filter: this.applyDateAndTimeFilters(filter, AudioRecording) };
  }

  private buildScopedFilter<Model extends AbstractModel>(): InnerFilter<Model> {
    let filter: InnerFilter<Model>;

    if (this.regions) {
      filter = filterModelIds<Model>(
        "region",
        Array.from(this.regions),
        filter!,
      );
    }

    if (this.sites) {
      filter = filterModelIds<Model>("site", Array.from(this.sites), filter!);
    }

    return filter!;
  }

  private applyDateAndTimeFilters<Model>(
    filter: InnerFilter<Model>,
    target: typeof AudioRecording | typeof AudioEvent,
  ): InnerFilter<Model> {
    if (target != AudioRecording && target != AudioEvent) {
      throw new Error(
        "applyDateAndTimeFilters can only be used with AudioRecording or AudioEvent",
      );
    }

    if (this.dateStartedAfter || this.dateFinishedBefore) {
      if (target === AudioEvent) {
        filter = filterEventDate(
          filter as InnerFilter<AudioEvent>,
          this.dateStartedAfter,
          this.dateFinishedBefore,
        ) as InnerFilter<Model>;
      } else {
        filter = filterDate(
          filter as InnerFilter<AudioRecording>,
          this.dateStartedAfter!,
          // @ts-expect-error: strict mode fix
          this.dateFinishedBefore,
        ) as InnerFilter<Model>;
      }
    }

    if (this.timeStartedAfter || this.timeFinishedBefore) {
      if (target === AudioEvent) {
        filter = filterEventTime(
          filter as InnerFilter<AudioEvent>,
          this.daylightSavings,
          this.timeStartedAfter,
          this.timeFinishedBefore,
        ) as InnerFilter<Model>;
      } else {
        filter = filterTime(
          filter as InnerFilter<AudioRecording>,
          this.daylightSavings,
          this.timeStartedAfter!,
          // @ts-expect-error: strict mode fix
          this.timeFinishedBefore,
        ) as InnerFilter<Model>;
      }
    }

    return filter;
  }

  public toQueryParams(): Params {
    const queryParameters =
      serializeObjectToParams<IEventSummaryReportParameters>(
        this,
        serializationTable,
      );

    return queryParameters;
  }
}
