import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { toBase64Url } from "@helpers/encoding/encoding";
import { filterDate, filterTime } from "@helpers/filters/audioRecordingFilters";
import { filterAnd, filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id } from "@interfaces/apiInterfaces";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { DateTime, Duration } from "luxon";

export enum ChartType {
  sensorPointMap = "Sensor Point Map",
  speciesAccumulationCurve = "Species Accumulation Curve",
  speciesCompositionCurve = "Species Composition Curve",
  falseColorSpectrograms = "False Colour Spectrograms",
}

export enum BinSize {
  day = "day",
  week = "week",
  fortnight = "fortnight",
  month = "month",
  season = "season",
  year = "year",
}

export interface IEventSummaryReportParameters {
  sites: Id[];
  points: Id[];
  provenances: Id[];
  events: Id[];
  recogniserCutOff: number;
  charts: string[];
  binSize: BinSize;
  ignoreDaylightSavings: boolean;
}

export class EventSummaryReportParameters
  implements IEventSummaryReportParameters
{
  public constructor(queryStringParameters: Params = {}) {
    const conversionTable = {
      sites: (value: string) => value.split(",").map(Number),
      points: (value: string) => value.split(",").map(Number),
      provenances: (value: string) => value.split(",").map(Number),
      events: (value: string) => value.split(",").map(Number),
      recogniserCutOff: (value: string) => Number(value),
      charts: (value: string) => value.split(","),
      binSize: (value: string) => value,
      ignoreDaylightSavings: (value: string) => value === "true",
      dateStartedAfter: (value: string) => DateTime.fromISO(value, { zone: "utc" }),
      dateFinishedBefore: (value: string) => DateTime.fromISO(value, { zone: "utc" }),
      timeStartedAfter: (value: string) => Duration.fromObject({
        hours: Number(value.split(":")[0]),
        minutes: Number(value.split(":")[1]),
      }),
      timeFinishedBefore: (value: string) => Duration.fromObject({
        hours: Number(value.split(":")[0]),
        minutes: Number(value.split(":")[1]),
      }),
    };

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
  public recogniserCutOff = 0;
  public charts: string[];
  public binSize: BinSize = BinSize.month;
  public ignoreDaylightSavings = true;
  public timeStartedAfter: Duration;
  public timeFinishedBefore: Duration;
  public dateStartedAfter: DateTime;
  public dateFinishedBefore: DateTime;

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

    // we use isInstantiated() here because 0 is a valid value for recogniserCutOff
    if (isInstantiated(this.recogniserCutOff)) {
      filter = filterAnd<EventSummaryReport>(filter, {
        score: {
          gteq: this.recogniserCutOff,
        },
      } as InnerFilter);
    }

    if (this.binSize) {
      filter = filterAnd<EventSummaryReport>(filter, {
        binSize: {
          eq: this.binSize,
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
        this.ignoreDaylightSavings,
        this.timeStartedAfter,
        this.timeFinishedBefore
      );
    }

    return { filter };
  }

  /** Converts the report parameters to filters and base64 encodes them */
  public toFilterString(): string {
    return toBase64Url(JSON.stringify(this.toFilter()));
  }

  public toQueryString(): string {
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

    return params.toString();
  }
}
