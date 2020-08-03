import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { AnalysisJobsService } from "./analysis-jobs.service";

describe("AnalysisJobsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AnalysisJobsService],
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
