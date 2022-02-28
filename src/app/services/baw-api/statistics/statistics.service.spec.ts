import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Statistics } from "@models/Statistics";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStatistics } from "@test/fakes/Statistics";
import { validateApiShow } from "@test/helpers/api-common";
import { StatisticsService } from "./statistics.service";

describe("StatisticsService", (): void => {
  const createModel = () => new Statistics(generateStatistics());
  const baseUrl = "/stats";
  let spec: SpectatorService<StatisticsService>;
  const createService = createServiceFactory({
    service: StatisticsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateApiShow(spec, Statistics, baseUrl, 5, createModel);
});
