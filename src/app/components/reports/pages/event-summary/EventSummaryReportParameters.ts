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

export type GraphType =
  | "Sensor Point Map"
  | "Species Accumulation Curve"
  | "Species Composition Curve"
  | "False Colour Spectrograms";

export type BinSize =
  | "day"
  | "week"
  | "fortnight"
  | "month"
  | "seasonally"
  | "year";

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

export class EventSummaryReportParameters implements IEventSummaryReportParameters {
  public constructor(queryStringParameters: Params = {}) {
    // since query string parameters are losely typed using a string from the user space
    // we have to use this hacky implementation of manual key-value checking and assignment
    Object.entries(queryStringParameters).forEach(([key, value]) => {
      if (key in this) {
        this[key] = value;
      }
    });
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: Id[] = [];
  public points: Id[] = [];
  public provenances: Id[] = [];
  public events: Id[] = [];
  public recogniserCutOff = 0;
  public charts: string[] = [];
  public binSize: BinSize = "month";
  public ignoreDaylightSavings = true;
  private _timeStartedAfter: Duration = null;
  private _timeFinishedBefore: Duration = null;
  private _dateStartedAfter: DateTime = null;
  private _dateFinishedBefore: DateTime = null;

  public get timeStartedAfter(): string {
    return this._timeStartedAfter?.toFormat("hh:mm");
  }

  public set timeStartedAfter(value: string | Duration) {
    if (typeof value === "string") {
      // assuming the time/duration format hh:mm. This is the same format emitted by the reports generation page
      const [hoursString, minutesString]: string[] = value.split(":");

      // we use Number instead of parseInt() here because we want to fail hard if the duration string is invalid
      // this is because parseInt() will parse as much of the number as possible omitting non-number characters
      // if parseInt was used, a user might input an invalid time, assume the time was correct and unknowingly be returned incorrect results
      this._timeStartedAfter = Duration.fromObject({
        hours: Number(hoursString),
        minutes: Number(minutesString)
      });
    } else {
      this._timeStartedAfter = value;
    }
  }

  public get timeFinishedBefore(): string {
    return this._timeFinishedBefore?.toFormat("hh:mm");
  }

  public set timeFinishedBefore(value: string | Duration) {
    if (typeof value === "string") {
      const [hoursString, minutesString]: string[] = value.split(":");

      this._timeFinishedBefore = Duration.fromObject({
        hours: Number(hoursString),
        minutes: Number(minutesString)
      });
    } else {
      this._timeFinishedBefore = value;
    }
  }

  public get dateStartedAfter(): string {
    return this._dateStartedAfter?.toFormat("yyyy-MM-dd");
  }

  public set dateStartedAfter(value: string | DateTime) {
    if (typeof value === "string") {
      this._dateStartedAfter = DateTime.fromFormat(value, "yyyy-MM-dd");
    } else {
      this._dateStartedAfter = value;
    }
  }

  public get dateFinishedBefore(): string {
    return this._dateFinishedBefore?.toFormat("yyyy-MM-dd");
  }

  public set dateFinishedBefore(value: string | DateTime) {
    if (typeof value === "string") {
      this._dateFinishedBefore = DateTime.fromFormat(value, "yyyy-MM-dd");
    } else {
      this._dateFinishedBefore = value;
    }
  }

  public toFilter(): Filters<EventSummaryReport> {
    let filter: InnerFilter<EventSummaryReport>;

    filter = filterModelIds<EventSummaryReport>(
      "region",
      this.sites,
      filter
    );
    filter = filterModelIds<EventSummaryReport>(
      "site",
      this.points,
      filter
    );
    filter = filterModelIds<EventSummaryReport>(
      "provenance",
      this.provenances,
      filter
    );
    filter = filterModelIds<EventSummaryReport>(
      "tag",
      this.events,
      filter
    );

    filter = filterAnd<EventSummaryReport>(
      filter,
      {
        score: {
          gteq: this.recogniserCutOff
        },
      } as InnerFilter
    );

    filter = filterDate(
      filter,
      this._dateStartedAfter,
      this._dateFinishedBefore
    );

    filter = filterTime(
      filter,
      this.ignoreDaylightSavings,
      this._timeStartedAfter,
      this._timeFinishedBefore
    );

    return { filter };
  }

  /** Converts the report parameters to filters and base64 encodes them */
  public toFilterString(): string {
    return toBase64Url(
      JSON.stringify(this.toFilter())
    );
  }

  public toQueryString(): string {
    let params = new HttpParams();

    Object.keys(this).forEach((key: string) => {
      const keyValue = this[key];

      if (isInstantiated(keyValue) && keyValue.length !== 0) {
        if (keyValue instanceof DateTime) {
          params = params.append(key.replace("_", ""), keyValue.toFormat("yyyy-MM-dd"));
        } else if (keyValue instanceof Duration) {
          params = params.append(key.replace("_", ""), keyValue.toFormat("hh:mm"));
        } else {
          params = params.append(key, keyValue);
        }
      }
    });

    return params.toString();
  }
}
