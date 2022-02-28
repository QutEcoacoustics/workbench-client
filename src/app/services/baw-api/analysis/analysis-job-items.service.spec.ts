import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJobItem } from "@test/fakes/AnalysisJobItem";
import { validateReadonlyApi } from "@test/helpers/api-common";
import { AnalysisJobItemsService } from "./analysis-job-items.service";

type Model = AnalysisJobItem;
type Params = [IdOr<AnalysisJob>];
type Service = AnalysisJobItemsService;

describe("AnalysisJobItemsService", (): void => {
  const createModel = () =>
    new AnalysisJobItem(generateAnalysisJobItem({ id: 10 }));
  const baseUrl = "/analysis_jobs/5/audio_recordings/";
  let spec: SpectatorService<AnalysisJobItemsService>;
  const createService = createServiceFactory({
    service: AnalysisJobItemsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi<Model, Params, Service>(
    spec,
    AnalysisJobItem,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "10",
    createModel,
    10,
    5
  );
});
