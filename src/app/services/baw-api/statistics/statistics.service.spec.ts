import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Statistics } from "@models/Statistics";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStatistics } from "@test/fakes/Statistics";
import { validateApiShow } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { StatisticsService } from "./statistics.service";

describe("StatisticsService", (): void => {
  const createModel = () => new Statistics(generateStatistics());
  const baseUrl = "/stats";
  let spec: SpectatorService<StatisticsService>;
  const createService = createServiceFactory({
    service: StatisticsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateApiShow(() => spec, Statistics, baseUrl, 5, createModel);
});
