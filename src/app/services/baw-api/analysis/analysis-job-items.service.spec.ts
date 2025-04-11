import { AnalysisJobItem } from "@models/AnalysisJobItem";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateAnalysisJobItem } from "@test/fakes/AnalysisJobItem";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { AnalysisJobItemsService } from "./analysis-job-items.service";

describe("AnalysisJobItemsService", (): void => {
  const createModel = () =>
    new AnalysisJobItem(generateAnalysisJobItem({ id: 10 }));
  const baseUrl = "/analysis_jobs/5/audio_recordings/";
  let spec: SpectatorService<AnalysisJobItemsService>;
  const createService = createServiceFactory({
    service: AnalysisJobItemsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi(
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
