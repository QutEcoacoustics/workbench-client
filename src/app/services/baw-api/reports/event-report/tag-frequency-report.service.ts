import { inject, Injectable } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import type { AudioEvent } from "@models/AudioEvent";
import { AssociationInjector } from "@models/ImplementsInjector";
import {
  SupportedTagBucketSize,
  TagFrequencyReportItem,
} from "@models/Reports";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { map } from "rxjs";
import { ReportEndpointService } from "./report-endpoint-common";

const endpoint = "/reports/tag_frequency";

@Injectable({ providedIn: "root" })
export class TagFrequencyReportService extends ReportEndpointService {
  private readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);

  public filter(
    filters: Filters<AudioEvent>,
    bucketSize: SupportedTagBucketSize,
  ) {
    return this.post<AudioEvent, TagFrequencyReportItem>(endpoint, filters, {
      bucketSize,
    }).pipe(
      map((rows) =>
        rows.map(
          (row) => new TagFrequencyReportItem(row, this.associationInjector),
        ),
      ),
    );
  }
}
