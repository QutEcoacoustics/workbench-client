import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateScript } from "@test/fakes/Script";
import {
  validateApiCreate,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";

type Model = Script;
type Params = [];
type Service = ScriptsService;

describe("ScriptsService", function () {
  const createModel = () => new Script(generateScript({ id: 5 }));
  const baseUrl = "/scripts/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: ScriptsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
});
