import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { BawApiService } from "../baw-api.service";
import { MockBawApiService } from "../mock/baseApiMock.service";
import { AnalysisJobsService } from "./analysis-jobs.service";

describe("AnalysisJobsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AnalysisJobsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AnalysisJobsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<AnalysisJob, AnalysisJobsService>("/analysis_jobs/");
  validateApiFilter<AnalysisJob, AnalysisJobsService>("/analysis_jobs/filter");
  validateApiShow<AnalysisJob, AnalysisJobsService>(
    "/analysis_jobs/5",
    5,
    new AnalysisJob({ id: 5 })
  );
  validateApiUpdate<AnalysisJob, AnalysisJobsService>(
    "/analysis_jobs/5",
    new AnalysisJob({ id: 5 })
  );
});
