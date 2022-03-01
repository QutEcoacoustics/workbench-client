import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAnalysisJobItem } from "@test/fakes/AnalysisJobItem";
import { validateReadonlyApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
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
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi<Model, Params, Service>(
    () => spec,
    AnalysisJobItem,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "10",
    createModel,
    10,
    5
  );
});
