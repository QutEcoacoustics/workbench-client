import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { AnalysisJobsService } from "./analysis-jobs.service";

type Model = AnalysisJob;
type Params = [];
type Service = AnalysisJobsService;

describe("AnalysisJobsService", function () {
  const createModel = () => new AnalysisJob(generateAnalysisJob(5));
  const baseUrl = "/analysis_jobs/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [AnalysisJobsService],
    });

    this.service = TestBed.inject(AnalysisJobsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
});
