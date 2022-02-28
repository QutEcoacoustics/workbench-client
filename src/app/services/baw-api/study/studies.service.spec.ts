import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Study } from "@models/Study";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateStudy } from "@test/fakes/Study";
import { validateStandardApi } from "@test/helpers/api-common";
import { StudiesService } from "./studies.service";

describe("StudiesService", (): void => {
  const createModel = () => new Study(generateStudy({ id: 5 }));
  const baseUrl = "/studies/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<StudiesService>;
  const createService = createServiceFactory({
    service: StudiesService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    spec,
    Study,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
