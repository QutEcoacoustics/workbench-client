import { HttpParams } from "@angular/common/http";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { toBase64Url } from "@helpers/encoding/encoding";
import { filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id } from "@interfaces/apiInterfaces";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { DateTime, Duration } from "luxon";

// these properties are serialised in the query strings, therefore, need to be user facing
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
  timeStartedAfter: string;
  timeFinishedBefore: string;
  dateStartedAfter: string;
  dateFinishedBefore: string;
  binSize: BinSize;
  ignoreDaylightSavings: boolean;
}

export class EventSummaryReportParameters implements IEventSummaryReportParameters {
  public constructor(
    regions?: Id[],
    sites?: Id[],
    provenances?: Id[],
    events?: Id[],
    provenanceCutOff?: number,
    charts?: string[],
    timeStartedAfter?: Duration,
    timeFinishedBefore?: Duration,
    dateStartedAfter?: DateTime,
    dateFinishedBefore?: DateTime,
    binSize?: BinSize,
    ignoreDaylightSavings?: boolean
  ) {
    this.sites = regions;
    this.points = sites;
    this.provenances = provenances;
    this.events = events;

    this.timeStartedAfter = timeStartedAfter?.toFormat("hh:mm");
    this.timeFinishedBefore = timeFinishedBefore?.toFormat("hh:mm");

    if (typeof dateStartedAfter === "string") {
      this.dateStartedAfter = DateTime.fromFormat(dateStartedAfter, "yyy-MM-dd");
    } else {
      this.dateStartedAfter = dateStartedAfter;
    }


    this.dateFinishedBefore = dateFinishedBefore?.toFormat("yyyy-MM-dd");

    this.recogniserCutOff = provenanceCutOff;
    this.charts = charts;
    this.binSize = binSize;
    this.ignoreDaylightSavings = ignoreDaylightSavings;
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: Id[];
  public points: Id[];
  public provenances: Id[];
  public events: Id[];
  public recogniserCutOff: number;
  public charts: string[];
  public timeStartedAfter: string;
  public timeFinishedBefore: string;
  public dateStartedAfter: DateTime;
  public dateFinishedBefore: string;
  public binSize: BinSize;
  public ignoreDaylightSavings: boolean;

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

    return { filter };
  }

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
        params = params.append(key, keyValue);
      }
    });

    return params.toString();
  }
}
