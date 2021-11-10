import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SavedSearch } from "@models/SavedSearch";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSavedSearch } from "@test/fakes/SavedSearch";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";
import { SavedSearchesService } from "./saved-searches.service";

type Model = SavedSearch;
type Params = [];
type Service = SavedSearchesService;

describe("SavedSearchesService", function () {
  const createModel = () => new SavedSearch(generateSavedSearch({ id: 5 }));
  const baseUrl = "/saved_searches/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: SavedSearchesService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
  validateApiDestroy<Model, Params, Service>(updateUrl, 5, createModel);
});
