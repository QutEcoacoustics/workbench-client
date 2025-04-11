import { Statistics } from "@models/Statistics";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateStatistics } from "@test/fakes/Statistics";
import { mockServiceImports, mockServiceProviders, validateApiShow } from "@test/helpers/api-common";
import { StatisticsService } from "./statistics.service";

describe("StatisticsService", (): void => {
  const createModel = () => new Statistics(generateStatistics());
  const baseUrl = "/stats";
  let spec: SpectatorService<StatisticsService>;
  const createService = createServiceFactory({
    service: StatisticsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateApiShow(() => spec, Statistics, baseUrl, 5, createModel);
});
