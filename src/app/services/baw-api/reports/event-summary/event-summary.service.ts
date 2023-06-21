import { Injectable } from "@angular/core";
import {
  IdOr,
  IdParamOptional,
  id,
  option,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { Observable, of } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id. However, this is planned for the future
// to backfill in preparation, this service has been backfilled
const reportId: IdParamOptional<AudioEventSummaryReport> = id;
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryReportService {
  public constructor(protected api: BawApiService<AudioEventSummaryReport>) {}

  // because filter returns an array of item, and we want to return one item given filter conditions
  // we cannot use the generalised filter service interface
  // TODO: generalise this service to an interface if more report types are added
  public filterShow(
    filters: Filters<AudioEventSummaryReport>
  ): Observable<AudioEventSummaryReport> {
    return of();
  }
}

export const eventSummaryResolvers = new Resolvers<
  AudioEventSummaryReport,
  [IdOr<AudioEventSummaryReport>]
>([], "reportId").create("AUDIO_EVENT_SUMMARY");
