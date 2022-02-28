import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AnalysisJob } from "@models/AnalysisJob";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { validateReadAndUpdateApi } from "@test/helpers/api-common";
import { AnalysisJobsService } from "./analysis-jobs.service";

describe("AnalysisJobsService", (): void => {
  const createModel = () => new AnalysisJob(generateAnalysisJob({ id: 5 }));
  const baseUrl = "/analysis_jobs/";
  let spec: SpectatorService<AnalysisJobsService>;
  const createService = createServiceFactory({
    service: AnalysisJobsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadAndUpdateApi(
    spec,
    AnalysisJob,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "5",
    createModel,
    5
  );
});
