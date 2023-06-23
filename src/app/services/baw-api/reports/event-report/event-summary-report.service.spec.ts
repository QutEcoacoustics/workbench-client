import { EventSummaryReport } from "@models/EventSummaryReport";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  defaultFilters,
  mockServiceImports,
  mockServiceProviders,
} from "@test/helpers/api-common";
import { of } from "rxjs";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { EventSummaryReportService } from "./event-summary-report.service";

describe("EventSummaryReportService", () => {
  const baseUrl = "/reports/audio_event_summary/";
  let spectator: SpectatorService<EventSummaryReportService>;

  const createService = createServiceFactory({
    service: EventSummaryReportService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spectator = createService();
  });

  // TODO: we should probably generalise this test wrapper to something similar to `validateCustomApiFilter`
  // this should be done if the filterShow service is generalised and expanded to other reports
  describe("Api FilterShow", () => {
    it("should handle filter endpoint", () => {
      const expectedFilters: Filters<EventSummaryReport> = defaultFilters;

      const mockApi: BawApiService<EventSummaryReport> = spectator.inject<
        BawApiService<EventSummaryReport>
      >(BawApiService);

      spyOn(mockApi, "filterShow").and.callFake(() =>
        of(new EventSummaryReport(generateEventSummaryReport()))
      );

      spectator.service.filterShow(defaultFilters).subscribe();

      expect(mockApi.filterShow).toHaveBeenCalledWith(
        EventSummaryReport,
        baseUrl + "filter",
        expectedFilters
      );
    });
  });
});
