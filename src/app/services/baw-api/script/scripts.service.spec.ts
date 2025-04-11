import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateScript } from "@test/fakes/Script";
import { mockServiceImports, mockServiceProviders, validateNonDestructableApi } from "@test/helpers/api-common";

describe("ScriptsService", function () {
  const createModel = () => new Script(generateScript({ id: 5 }));
  const baseUrl = "/scripts/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ScriptsService>;
  const createService = createServiceFactory({
    service: ScriptsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateNonDestructableApi(() => spec, Script, baseUrl, baseUrl + "filter", updateUrl, createModel, 5);
});
