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

  beforeEach(() => {
    spectator = createService();
  });

  // TODO: enable this test once the API is fully functional, and we are not longer returning a mock model
  describe("Api FilterShow", () => {
    xit("should handle filter endpoint", () => {
      const expectedFilters: Filters<EventSummaryReport> = defaultFilters;

      const mockApi: BawApiService<EventSummaryReport> = spectator.inject<
        BawApiService<EventSummaryReport>
      >(BawApiService);

      spyOn(mockApi, "filterShow").and.returnValue(
        of(new EventSummaryReport(generateEventSummaryReport()))
      );

      spectator.service.filterShow(defaultFilters);

      expect(mockApi.filterShow).toHaveBeenCalledWith(
        EventSummaryReport,
        baseUrl + "filter",
        expectedFilters
      );
    });
  });
});
