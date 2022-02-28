import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SavedSearch } from "@models/SavedSearch";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSavedSearch } from "@test/fakes/SavedSearch";
import { validateImmutableApi } from "@test/helpers/api-common";
import { SavedSearchesService } from "./saved-searches.service";

describe("SavedSearchesService", (): void => {
  const createModel = () => new SavedSearch(generateSavedSearch({ id: 5 }));
  const baseUrl = "/saved_searches/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<SavedSearchesService>;
  const createService = createServiceFactory({
    service: SavedSearchesService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateImmutableApi(
    spec,
    SavedSearch,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
