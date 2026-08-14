import { Statistics } from "@models/Statistics";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateStatistics } from "@test/fakes/Statistics";
import {
  mockServiceProviders,
  validateApiShow,
} from "@test/helpers/api-common";
import { StatisticsService } from "./statistics.service";

describe("StatisticsService", (): void => {
  const createModel = () => new Statistics(generateStatistics());
  const baseUrl = "/stats";
  let spec: SpectatorService<StatisticsService>;

  const createService = createServiceFactory({
    service: StatisticsService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  validateApiShow(() => spec, Statistics, baseUrl, 5, createModel);
});
