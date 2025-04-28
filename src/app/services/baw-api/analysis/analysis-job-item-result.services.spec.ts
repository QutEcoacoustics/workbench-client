import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import {
  mockServiceProviders,
  validateApiShow,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { AnalysisJobItemResultsService } from "./analysis-job-item-result.service";

describe("AnalysisJobItemsResultsService", (): void => {
  let spec: SpectatorService<AnalysisJobItemResultsService>;
  const baseUrl = "/analysis_jobs/10/results/15/";
  const mockResultsPath = "testA/testB/fileA.csv";

  const createModel = () =>
    new AnalysisJobItemResult(
      generateAnalysisJobResults({
        id: 5,
        resultsPath: mockResultsPath,
      })
    );

  const createService = createServiceFactory({
    service: AnalysisJobItemResultsService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateReadonlyApi(
    () => spec,
    AnalysisJobItemResult,
    baseUrl, // list
    baseUrl + "filter", // filter
    baseUrl + mockResultsPath, // show
    createModel,
    undefined, // analysis job item results
    10, // analysis job
    15, // audio recording
    undefined // options
  );

  validateApiShow(
    () => spec as any,
    AnalysisJobItemResult,
    baseUrl + mockResultsPath,
    undefined,
    createModel,
    10,
    15
  );
});
