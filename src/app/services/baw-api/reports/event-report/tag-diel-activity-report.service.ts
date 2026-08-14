import { inject, Injectable } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { AssociationInjector } from "@models/ImplementsInjector";
import {
  SupportedDielBucketSize,
  TagDielActivityReportItem,
} from "@models/Reports";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { map } from "rxjs";
import { ReportEndpointService } from "./report-endpoint-common";

const endpoint = "/reports/tag_diel_activity";

@Injectable({ providedIn: "root" })
export class TagDielActivityReportService extends ReportEndpointService {
  private readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);

  public filter(
    filters: Filters<AudioEvent>,
    bucketSize: SupportedDielBucketSize,
  ) {
    return this.post<AudioEvent, TagDielActivityReportItem>(endpoint, filters, {
      bucketSize,
    }).pipe(
      map((rows) =>
        rows.map(
          (row) => new TagDielActivityReportItem(row, this.associationInjector),
        ),
      ),
    );
  }
}
