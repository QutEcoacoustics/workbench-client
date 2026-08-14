import { ApiResponse, BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AuthToken } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { defaultFilters, mockServiceProviders } from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { of } from "rxjs";
import { AnalysisCoverageReportService } from "./analysis-coverage-report.service";
import { EventSummariesReportService } from "./event-summaries-report.service";
import { RecordingCoverageReportService } from "./recording-coverage-report.service";
import { TagAccumulationReportService } from "./tag-accumulation-report.service";
import { TagDielActivityReportService } from "./tag-diel-activity-report.service";
import { TagFrequencyReportService } from "./tag-frequency-report.service";

function createResponse<T>(data: T[]): ApiResponse<T[]> {
  return {
    meta: {
      status: 200,
      message: "OK",
    },
    data,
  };
}

describe("report endpoint services", () => {
  describe("TagAccumulationReportService", () => {
    let spectator: SpectatorService<TagAccumulationReportService>;

    const createService = createServiceFactory({
      service: TagAccumulationReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the tag accumulation report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters, "month").subscribe();

      expect(api.httpPost).toHaveBeenCalledWith("/reports/tag_accumulation", {
        filter: defaultFilters.filter,
        options: { bucketSize: "month" },
      });
    });
  });

  describe("TagFrequencyReportService", () => {
    let spectator: SpectatorService<TagFrequencyReportService>;

    const createService = createServiceFactory({
      service: TagFrequencyReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the tag frequency report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters, "week").subscribe();

      expect(api.httpPost).toHaveBeenCalledWith("/reports/tag_frequency", {
        filter: defaultFilters.filter,
        options: { bucketSize: "week" },
      });
    });
  });

  describe("TagDielActivityReportService", () => {
    let spectator: SpectatorService<TagDielActivityReportService>;

    const createService = createServiceFactory({
      service: TagDielActivityReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the tag diel activity report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters, "half-hour").subscribe();

      expect(api.httpPost).toHaveBeenCalledWith(
        "/reports/tag_diel_activity",
        {
          filter: defaultFilters.filter,
          options: { bucketSize: "half-hour" },
        },
      );
    });
  });

  describe("EventSummariesReportService", () => {
    let spectator: SpectatorService<EventSummariesReportService>;

    const createService = createServiceFactory({
      service: EventSummariesReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the event summaries report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters).subscribe();

      expect(api.httpPost).toHaveBeenCalledWith("/reports/event_summaries", {
        filter: defaultFilters.filter,
      });
    });

    it("should refresh the report after post-initial authentication changes", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      const session = spectator.inject(BawSessionService);
      const user = new User(generateUser());
      const authToken: AuthToken = modelData.authToken();
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters).subscribe();
      session.setLoggedInUser(user, authToken);
      session.clearLoggedInUser();

      expect(api.httpPost).toHaveBeenCalledTimes(3);
    });
  });

  describe("AnalysisCoverageReportService", () => {
    let spectator: SpectatorService<AnalysisCoverageReportService>;

    const createService = createServiceFactory({
      service: AnalysisCoverageReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the analysis coverage report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters, 100).subscribe();

      expect(api.httpPost).toHaveBeenCalledWith(
        "/reports/analysis_coverage",
        {
          filter: defaultFilters.filter,
          options: { bucketCount: 100 },
        },
      );
    });
  });

  describe("RecordingCoverageReportService", () => {
    let spectator: SpectatorService<RecordingCoverageReportService>;

    const createService = createServiceFactory({
      service: RecordingCoverageReportService,
      providers: mockServiceProviders,
    });

    beforeEach(() => {
      spectator = createService();
      spectator.inject(BawSessionService).completeInitialAuthCheck();
    });

    it("should call the recording coverage report endpoint", () => {
      const api = spectator.inject<BawApiService<any>>(BawApiService);
      spyOn(api, "httpPost").and.returnValue(of(createResponse([])));

      spectator.service.filter(defaultFilters, 50).subscribe();

      expect(api.httpPost).toHaveBeenCalledWith(
        "/reports/recording_coverage",
        {
          filter: defaultFilters.filter,
          options: { bucketCount: 50 },
        },
      );
    });
  });
});