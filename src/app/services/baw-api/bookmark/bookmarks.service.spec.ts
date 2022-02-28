import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateBookmark } from "@test/fakes/Bookmark";
import {
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";
import { BookmarksService } from "./bookmarks.service";

describe("BookmarksService", (): void => {
  const createModel = () => new Bookmark(generateBookmark({ id: 5 }));
  const baseUrl = "/bookmarks/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<BookmarksService>;
  const createService = createServiceFactory({
    service: BookmarksService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    spec,
    Bookmark,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  validateCustomApiFilter<Bookmark, [IdOr<User>], BookmarksService>(
    spec,
    Bookmark,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );
});
