import { EventSummaryReport } from "@models/EventSummaryReport";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  defaultFilters,
  mockServiceImports,
  mockServiceProviders,
} from "@test/helpers/api-common";
import { of } from "rxjs";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { generateEventSummaryReport } from "@test/fakes/EventSummaryReport";
import { EventSummaryReportService } from "./event-summary-report.service";

describe("EventSummaryReportService", () => {
  const baseUrl = "/reports/audio_event_summary/";
  let spectator: SpectatorService<EventSummaryReportService>;

  const createService = createServiceFactory({
    service: EventSummaryReportService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe("Api FilterShow", () => {
    it("should handle the filter show endpoint", () => {
      const expectedFilters: Filters<EventSummaryReport> = defaultFilters;

      const mockApi: BawApiService<EventSummaryReport> = spectator.inject<
        BawApiService<EventSummaryReport>
      >(BawApiService);

      spyOn(mockApi, "filterShow").and.returnValue(
        of(new EventSummaryReport(generateEventSummaryReport()))
      );

      mockApi.filterShow(
        EventSummaryReport,
        baseUrl + "filter",
        defaultFilters
      ).subscribe();

      expect(mockApi.filterShow).toHaveBeenCalledWith(
        EventSummaryReport,
        baseUrl + "filter",
        expectedFilters
      );
    });
  });
});
