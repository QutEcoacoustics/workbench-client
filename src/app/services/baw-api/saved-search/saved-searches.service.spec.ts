import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SavedSearch } from "@models/SavedSearch";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSavedSearch } from "@test/fakes/SavedSearch";
import { validateImmutableApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { SavedSearchesService } from "./saved-searches.service";

describe("SavedSearchesService", (): void => {
  const createModel = () => new SavedSearch(generateSavedSearch({ id: 5 }));
  const baseUrl = "/saved_searches/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<SavedSearchesService>;
  const createService = createServiceFactory({
    service: SavedSearchesService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateImmutableApi(
    () => spec,
    SavedSearch,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
