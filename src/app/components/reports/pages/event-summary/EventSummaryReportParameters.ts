import { Params } from "@angular/router";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  dateTimeArrayToQueryString,
  durationArrayToQueryString,
  queryStringArray,
  queryStringBoolean,
  queryStringDateTimeArray,
  queryStringDurationTimeArray,
  queryStringNumber,
  queryStringToNumberArray,
} from "@helpers/query-string-parameters/query-string-parameters";
import { Id } from "@interfaces/apiInterfaces";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { DateTime, Duration } from "luxon";

export enum Chart {
  sensorPointMap = "Sensor Point Map",
  speciesAccumulationCurve = "Species Accumulation Curve",
  speciesCompositionCurve = "Species Composition Curve",
  falseColorSpectrograms = "False Colour Spectrograms",
}

export enum BucketSize {
  day = "day",
  week = "week",
  fortnight = "fortnight",
  month = "month",
  season = "season",
  year = "year",
}

const conversionTable = {
  sites: (value: string) => queryStringToNumberArray(value),
  points: (value: string) => queryStringToNumberArray(value),
  provenances: (value: string) => queryStringToNumberArray(value),
  events: (value: string) => queryStringToNumberArray(value),
  score: (value: string) => queryStringNumber(value),
  charts: (value: string) => queryStringArray(value),
  bucketSize: (value: string) => value,
  daylightSavings: (value: string) => queryStringBoolean(value),
  date: (value: string) => queryStringDateTimeArray(value),
  time: (value: string) => queryStringDurationTimeArray(value),
};

export class EventSummaryReportParameters {
  public constructor(queryStringParameters: Params = {}) {
    // since query string parameters are losely typed using a string from the user space
    // we have to use this hacky implementation of manual key-value checking and assignment
    Object.entries(queryStringParameters).forEach(([key, value]) => {
      if (key in conversionTable) {
        this[key] = conversionTable[key](value);
      }
    });
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: Id[];
  public points: Id[];
  public provenances: Id[];
  public events: Id[];
  public score = 0;
  public charts: Chart[];
  public bucketSize: BucketSize = BucketSize.month;
  public daylightSavings: boolean;
  public time: Duration[];
  public date: DateTime[];

  public get dateStartedAfter(): DateTime {
    return this.date ? this.date[0] : null;
  }

  public get dateFinishedBefore(): DateTime {
    return this.date ? this.date[1] : null;
  }

  public get timeStartedAfter(): Duration {
    return this.time ? this.time[0] : null;
  }

  public get timeFinishedBefore(): Duration {
    return this.time ? this.time[1] : null;
  }

  public toFilter(): Filters<EventSummaryReport> {
    let filter: InnerFilter<EventSummaryReport>;

    if (this.sites) {
      filter = filterModelIds<EventSummaryReport>("region", this.sites, filter);
    }

    if (this.points) {
      filter = filterModelIds<EventSummaryReport>("site", this.points, filter);
    }

    if (this.provenances) {
      filter = filterModelIds<EventSummaryReport>(
        "provenance",
        this.provenances,
        filter
      );
    }

    if (this.events) {
      filter = filterModelIds<EventSummaryReport>("tag", this.events, filter);
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
      filter = filterAnd<EventSummaryReport>(filter, {
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
    const paramsObject: Params = {};

    Object.entries(this).forEach(([key, value]) => {
      if (key in conversionTable) {
        if (value instanceof Array) {
          if (value[0] instanceof DateTime || value[1] instanceof DateTime) {
            paramsObject[key] = dateTimeArrayToQueryString(value);
          } else if (value[0] instanceof Duration || value[1] instanceof Duration) {
            paramsObject[key] = durationArrayToQueryString(value);
          } else {
            paramsObject[key] = value;
          }
        } else {
          paramsObject[key] = value;
        }
      }
    });

    return paramsObject;
  }
}
