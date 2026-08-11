import { inject, Injectable } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { AssociationInjector } from "@models/ImplementsInjector";
import { AnalysisCoverageItem } from "@models/Reports";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { map } from "rxjs";
import { ReportEndpointService } from "./report-endpoint-common";

const endpoint = "/reports/analysis_coverage";

@Injectable({ providedIn: "root" })
export class AnalysisCoverageReportService extends ReportEndpointService {
  private readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);

  public filter(filters: Filters<AudioRecording>, bucketCount: number) {
    return this.post<AudioRecording, AnalysisCoverageItem>(endpoint, filters, {
      bucketCount,
    }).pipe(
      map((rows) =>
        rows.map(
          (row) => new AnalysisCoverageItem(row, this.associationInjector),
        ),
      ),
    );
  }
}
