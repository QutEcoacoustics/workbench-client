import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SavedSearch } from "@models/SavedSearch";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
} from "@test/helpers/api-common";
import { SavedSearchesService } from "./saved-searches.service";

describe("SavedSearchesService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [SavedSearchesService],
    });

    this.service = TestBed.inject(SavedSearchesService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<SavedSearch, SavedSearchesService>("/saved_searches/");
  validateApiFilter<SavedSearch, SavedSearchesService>(
    "/saved_searches/filter"
  );
  validateApiShow<SavedSearch, SavedSearchesService>(
    "/saved_searches/5",
    5,
    new SavedSearch({ id: 5 })
  );
  validateApiCreate<SavedSearch, SavedSearchesService>(
    "/saved_searches/",
    new SavedSearch({ id: 5 })
  );
  validateApiDestroy<SavedSearch, SavedSearchesService>(
    "/saved_searches/5",
    5,
    new SavedSearch({ id: 5 })
  );
});
