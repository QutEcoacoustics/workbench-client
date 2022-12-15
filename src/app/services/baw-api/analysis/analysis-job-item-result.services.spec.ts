import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import {
  mockServiceImports,
  mockServiceProviders,
  validateApiShow,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { AnalysisJobItemResultsService } from "./analysis-job-item-result.service";

describe("AnalysisJobItemsResultsService", (): void => {
  let spec: SpectatorService<AnalysisJobItemResultsService>;
  const baseUrl = "/analysis_jobs/10/results/15/";
  const mockFileName = "testA/testB/fileA.csv";

  const createModel = () =>
    new AnalysisJobItemResult(
      generateAnalysisJobResults({
        id: 5,
        name: mockFileName,
      })
    );

  const createService = createServiceFactory({
    service: AnalysisJobItemResultsService,
    imports: mockServiceImports,
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
    baseUrl + mockFileName, // show
    createModel,
    undefined, // analysis job item results
    10, // analysis job
    15, // audio recording
    undefined // options
  );

  validateApiShow(
    () => spec as any,
    AnalysisJobItemResult,
    baseUrl + mockFileName,
    undefined,
    createModel,
    10,
    15
  );
});
