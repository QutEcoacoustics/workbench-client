import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateTag } from "@test/fakes/Tag";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { TagsService } from "./tags.service";

type Model = Tag;
type Params = [];
type Service = TagsService;

describe("TagsService", function () {
  const createModel = () => new Tag(generateTag({ id: 5 }));
  const baseUrl = "/tags/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: TagsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel);
  validateApiDestroy<Model, Params, Service>(updateUrl, 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  // TODO Add tests for tag types
});
