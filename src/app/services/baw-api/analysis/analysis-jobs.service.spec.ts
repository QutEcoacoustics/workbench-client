import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AnalysisJob } from "@models/AnalysisJob";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { validateReadAndUpdateApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { AnalysisJobsService } from "./analysis-jobs.service";

describe("AnalysisJobsService", (): void => {
  const createModel = () => new AnalysisJob(generateAnalysisJob({ id: 5 }));
  const baseUrl = "/analysis_jobs/";
  let spec: SpectatorService<AnalysisJobsService>;
  const createService = createServiceFactory({
    service: AnalysisJobsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadAndUpdateApi(
    () => spec,
    AnalysisJob,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "5",
    createModel,
    5
  );
});
