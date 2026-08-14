import { inject, Injectable } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { AssociationInjector } from "@models/ImplementsInjector";
import { EventSummaryItem } from "@models/Reports";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { map } from "rxjs";
import { ReportEndpointService } from "./report-endpoint-common";

const endpoint = "/reports/event_summaries";

@Injectable({ providedIn: "root" })
export class EventSummariesReportService extends ReportEndpointService {
  private readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);

  public filter(filters: Filters<AudioEvent>) {
    return this.post<AudioEvent, EventSummaryItem>(endpoint, filters).pipe(
      map((rows) =>
        rows.map((row) => new EventSummaryItem(row, this.associationInjector)),
      ),
    );
  }
}
