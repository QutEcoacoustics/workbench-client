import { Injectable } from "@angular/core";
import { ApiFilter, ApiShow, IdOr, IdParamOptional, emptyParam, id, option } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventSummaryReport } from "@models/AudioEventSummaryReport";
import { Observable } from "rxjs";

// at the current moment, the api does not support fetching saved reports from id. However, this is planned for the future
// to backfill in preparation, this service has been backfilled
const reportId: IdParamOptional<AudioEventSummaryReport> = id;
const endpoint = stringTemplate`/reports/audio_event_summary/${reportId}${option}`;

@Injectable()
export class EventSummaryService implements ApiFilter<AudioEventSummaryReport>, ApiShow<AudioEventSummaryReport> {
  public constructor(protected api: BawApiService<AudioEventSummaryReport>) {}

  public filter(
    filters: Filters<AudioEventSummaryReport>,
    model?: IdOr<AudioEventSummaryReport>
  ) {
    return this.api.filter(
      AudioEventSummaryReport,
      endpoint(model, emptyParam),
      filters
    );
  }

  public show(model: IdOr<AudioEventSummaryReport>): Observable<AudioEventSummaryReport> {
    return this.api.show(AudioEventSummaryReport, endpoint(model, emptyParam));
  }
}
