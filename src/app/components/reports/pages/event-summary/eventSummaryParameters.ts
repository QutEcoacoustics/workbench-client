import { HttpParams } from "@angular/common/http";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { filterModelIds } from "@helpers/filters/filters";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";

export class EventSummaryReportParameters {
  public constructor(
    regions?: Id[],
    sites?: Id[],
    provenances?: Id[],
    events?: Id[],
    provenanceCutOff?: number,
    charts?: string[]
  ) {
    this.sites = regions;
    this.points = sites;
    this.provenances = provenances;
    this.events = events;
    this.provenanceCutOff = provenanceCutOff;
    this.charts = charts;
  }

  // since these properties are exposed to the user in the form of query string parameters
  // we use the user friendly names
  public sites: Id[];
  public points: Id[];
  public provenances: Id[];
  public events: Id[];
  public provenanceCutOff: number;
  public charts: string[];

  public toFilter(): Filters<AudioEventSummaryReport> {
    let filter: InnerFilter<AudioEventSummaryReport>;

    filter = filterModelIds<AudioEventSummaryReport>(
      "region",
      this.sites,
      filter
    );
    filter = filterModelIds<AudioEventSummaryReport>(
      "site",
      this.points,
      filter
    );
    filter = filterModelIds<AudioEventSummaryReport>(
      "provenance",
      this.provenances,
      filter
    );
    filter = filterModelIds<AudioEventSummaryReport>(
      "tag",
      this.events,
      filter
    );

    return { filter };
  }

  public toQueryString(): string {
    let params = new HttpParams();

    Object.keys(this).forEach(
      (key: string) => {
        const keyValue = this[key];

        if (isInstantiated(keyValue) && keyValue.length !== 0) {
          params = params.append(key, keyValue);
        }
      }
    );

    return params.toString();
  }
}
