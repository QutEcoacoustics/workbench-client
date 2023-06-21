import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { EventSummaryReportService } from "@baw-api/reports/event-summary/event-summary.service";
import { ShowResolver } from "@baw-api/resolver-common";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { Observable } from "rxjs";
import { EventSummaryReportParameters } from "./eventSummaryParameters";

@Injectable()
export class QueryParameterResolver
  implements Resolve<AudioEventSummaryReport>
{
  public constructor(
    private audioEventSummaryReportApi: EventSummaryReportService
  ) {}

  public resolve(
    route: ActivatedRouteSnapshot
  ): Observable<AudioEventSummaryReport> {
    const parametersModel = new EventSummaryReportParameters(
      route.paramMap.getAll("sites").map((id) => parseInt(id, 10)),
      route.paramMap.getAll("points").map((id) => parseInt(id, 10)),
      route.paramMap.getAll("provenances").map((id) => parseInt(id, 10)),
      route.paramMap.getAll("events").map((id) => parseInt(id, 10)),
      parseInt(route.paramMap.get("provenanceCutOff"), 10),
      route.paramMap.getAll("charts")
    );
    const filters = parametersModel.toFilter();

    return this.audioEventSummaryReportApi.filterShow(filters);
  }
}

export const parameterResolver = new ShowResolver<AudioEventSummaryReport, []>(
  [],
  "eventSummaryReportId",
).create("EventSummaryReport");
