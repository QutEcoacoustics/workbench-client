import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateTagGroup } from "@test/fakes/TagGroup";
import { validateStandardApi } from "@test/helpers/api-common";

describe("TagGroupService", (): void => {
  const createModel = () => new TagGroup(generateTagGroup({ id: 5 }));
  const baseUrl = "/tag_groups/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<TagGroupsService>;
  const createService = createServiceFactory({
    service: TagGroupsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    spec,
    TagGroup,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );
});
