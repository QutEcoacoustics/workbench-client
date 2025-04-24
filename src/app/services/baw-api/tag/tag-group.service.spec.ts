import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateTagGroup } from "@test/fakes/TagGroup";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";

describe("TagGroupService", (): void => {
  const createModel = () => new TagGroup(generateTagGroup({ id: 5 }));
  const baseUrl = "/tag_groups/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<TagGroupsService>;

  const createService = createServiceFactory({
    service: TagGroupsService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    TagGroup,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
