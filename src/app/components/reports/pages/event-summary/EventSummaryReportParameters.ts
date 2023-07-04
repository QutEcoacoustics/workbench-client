import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { Tuple } from "@helpers/advancedTypes";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
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

export enum ChartType {
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
  public charts: string[];
  public bucketSize: BucketSize = BucketSize.month;
  public daylightSavings = true;
  public time: Tuple<Duration, 2>;
  public date: Tuple<DateTime, 2>;

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

  public toHttpParams(): Params {
    let params = new HttpParams();

    Object.keys(this).forEach((key: string) => {
      const keyValue = this[key];

      if (isInstantiated(keyValue) && keyValue.length !== 0) {
        if (keyValue instanceof DateTime) {
          params = params.append(key, keyValue.toFormat("yyyy-MM-dd"));
        } else if (keyValue instanceof Duration) {
          params = params.append(key, keyValue.toFormat("hh:mm"));
        } else {
          // appending an array of Ids (numbers) to HttpParams will result in a comma separated string values
          // this is handled by Angular and does not require any additional logic
          params = params.append(key, keyValue);
        }
      }
    });

    return params;
  }
}
