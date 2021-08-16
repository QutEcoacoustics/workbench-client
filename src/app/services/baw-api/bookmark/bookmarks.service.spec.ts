import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateBookmark } from "@test/fakes/Bookmark";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { BookmarksService } from "./bookmarks.service";

type Model = Bookmark;
type Params = [];
type Service = BookmarksService;

describe("BookmarksService", function () {
  const createModel = () => new Bookmark(generateBookmark({ id: 5 }));
  const baseUrl = "/bookmarks/";
  const createService = createServiceFactory({
    service: BookmarksService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );
});
