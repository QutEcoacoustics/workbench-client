import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Statistics } from "@models/Statistics";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStatistics } from "@test/fakes/Statistics";
import { validateApiShow } from "@test/helpers/api-common";
import { StatisticsService } from "./statistics.service";

type Model = Statistics;
type Params = [];
type Service = StatisticsService;

describe("UserService", function () {
  const createModel = () => new Statistics(generateStatistics());
  const baseUrl = "/stats";
  const createService = createServiceFactory({
    service: StatisticsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiShow<Model, Params, Service>(baseUrl, 5, createModel);
});
