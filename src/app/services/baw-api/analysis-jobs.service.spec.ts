import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import { testAppInitializer } from "src/app/test.helper";
import { AnalysisJobsService } from "./analysis-jobs.service";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";

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
  validateApiCreate<AnalysisJob, AnalysisJobsService>(
    "/analysis_jobs/",
    new AnalysisJob({ id: 5 })
  );
  validateApiUpdate<AnalysisJob, AnalysisJobsService>(
    "/analysis_jobs/5",
    new AnalysisJob({ id: 5 })
  );
  validateApiDestroy<AnalysisJob, AnalysisJobsService>(
    "/analysis_jobs/5",
    5,
    new AnalysisJob({ id: 5 })
  );
});
