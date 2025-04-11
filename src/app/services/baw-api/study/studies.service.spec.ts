import { Study } from "@models/Study";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateStudy } from "@test/fakes/Study";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { StudiesService } from "./studies.service";

describe("StudiesService", (): void => {
  const createModel = () => new Study(generateStudy({ id: 5 }));
  const baseUrl = "/studies/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<StudiesService>;
  const createService = createServiceFactory({
    service: StudiesService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(() => spec, Study, baseUrl, baseUrl + "filter", updateUrl, createModel, 5);
});
