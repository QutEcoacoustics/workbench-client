import { inject, Injectable } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { AssociationInjector } from "@models/ImplementsInjector";
import { AudioRecordingCoverageItem } from "@models/Reports";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { map } from "rxjs";
import { ReportEndpointService } from "./report-endpoint-common";

const endpoint = "/reports/recording_coverage";

@Injectable({ providedIn: "root" })
export class RecordingCoverageReportService extends ReportEndpointService {
  private readonly associationInjector =
    inject<AssociationInjector>(ASSOCIATION_INJECTOR);

  public filter(filters: Filters<AudioRecording>, bucketCount: number) {
    return this.post<AudioRecording, AudioRecordingCoverageItem>(
      endpoint,
      filters,
      {
        bucketCount,
      },
    ).pipe(
      map((rows) =>
        rows.map(
          (row) =>
            new AudioRecordingCoverageItem(row, this.associationInjector),
        ),
      ),
    );
  }
}
