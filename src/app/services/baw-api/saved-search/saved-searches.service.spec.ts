import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { SavedSearch } from "@models/SavedSearch";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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
  const createModel = () => new SavedSearch(generateSavedSearch(5));
  const baseUrl = "/saved_searches/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [SavedSearchesService],
    });

    this.service = TestBed.inject(SavedSearchesService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});
