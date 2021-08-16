import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
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
  const createModel = () => new AnalysisJob(generateAnalysisJob({ id: 5 }));
  const baseUrl = "/analysis_jobs/";
  const createService = createServiceFactory({
    service: AnalysisJobsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
});
