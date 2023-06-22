import { HttpParams } from "@angular/common/http";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
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

interface IEventSummaryReportParameters {
  sites: Id[];
  points: Id[];
  provenances: Id[];
  events: Id[];
  provenanceCutOff: number;
  charts: string[];
  timeStartedAfter: string;
  timeFinishedBefore: string;
  dateStartedAfter: string;
  dateFinishedBefore: string;
}

export class EventSummaryReportParameters implements IEventSummaryReportParameters {
  public constructor(
    regions?: Id[] | string,
    sites?: Id[] | string,
    provenances?: Id[] | string,
    events?: Id[] | string,
    provenanceCutOff?: number,
    charts?: string[],
    timeStartedAfter?: Duration,
    timeFinishedBefore?: Duration,
    dateStartedAfter?: DateTime,
    dateFinishedBefore?: DateTime
  ) {
    if (typeof regions === "string") {
      this.sites = regions.split(",").map(Number);
    } else {
      this.sites = regions as Id[];
    }

    if (typeof sites === "string") {
      this.points = sites.split(",").map(Number);
    } else {
      this.sites = sites as Id[];
    }

    if (typeof provenances === "string") {
      this.provenances = provenances.split(",").map(Number);
    } else {
      this.provenances = provenances as Id[];
    }

    if (typeof events === "string") {
      this.events = events.split(",").map(Number);
    } else {
      this.events = events as Id[];
    }

    this.timeStartedAfter = this.formatDuration(timeStartedAfter);
    this.timeFinishedBefore = this.formatDuration(timeFinishedBefore);
    this.dateStartedAfter = this.formatDateTime(dateStartedAfter);
    this.dateFinishedBefore = this.formatDateTime(dateFinishedBefore);

    this.provenanceCutOff = provenanceCutOff;
    this.charts = charts;
  }

  private formatDateTime(dateTime: DateTime): string {
    if (dateTime !== undefined) {
      return dateTime as any;
    }

    return undefined;
  }

  private formatDuration(duration: Duration): string {
    if (duration !== undefined) {
      return duration as any;
    }

    return undefined;
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: Id[];
  public points: Id[];
  public provenances: Id[];
  public events: Id[];
  public provenanceCutOff: number;
  public charts: string[];
  public timeStartedAfter: string;
  public timeFinishedBefore: string;
  public dateStartedAfter: string;
  public dateFinishedBefore: string;

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
