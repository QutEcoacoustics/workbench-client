import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ScriptsService } from "@baw-api/script/scripts.service";
import { Script } from "@models/Script";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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
  const createModel = () => new Script(generateScript(5));
  const baseUrl = "/scripts/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ScriptsService],
    });
    this.service = TestBed.inject(ScriptsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
});
