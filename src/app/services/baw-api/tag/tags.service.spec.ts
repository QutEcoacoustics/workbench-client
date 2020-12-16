import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
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
  const createModel = () => new Tag(generateTag(5));
  const baseUrl = "/tags/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [TagsService],
    });
    this.service = TestBed.inject(TagsService);
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

  // TODO Add tests for tag types
});
