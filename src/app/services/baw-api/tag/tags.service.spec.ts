import { IdOr } from "@baw-api/api-common";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { generateTag } from "@test/fakes/Tag";
import {
  mockServiceProviders,
  validateApiDestroy,
  validateApiUpdate,
  validateCustomApiFilter,
  validateReadAndCreateApi,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { TagsService } from "./tags.service";

describe("TagsService", (): void => {
  const modelId = modelData.id();
  const createModel = () => new Tag(generateTag({ id: modelId }));
  const baseUrl = "/tags/";
  const updateUrl = "/admin/tags/";

  const createService = createServiceFactory({
    service: TagsService,
    providers: mockServiceProviders,
  });

  validateReadAndCreateApi(
    createService,
    Tag,
    baseUrl,
    baseUrl + "filter",
    baseUrl + modelId,
    createModel,
    modelId,
  );

  validateApiUpdate(
    createService,
    Tag,
    updateUrl + modelId,
    createModel,
  );

  validateApiDestroy(
    createService,
    updateUrl + modelId,
    modelId,
    createModel,
  );

  validateCustomApiFilter<Tag, [IdOr<User>], TagsService>(
    createService,
    Tag,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  // TODO Add tests for tag types
});
