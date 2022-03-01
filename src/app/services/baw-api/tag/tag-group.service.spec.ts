import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateTagGroup } from "@test/fakes/TagGroup";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";

describe("TagGroupService", (): void => {
  const createModel = () => new TagGroup(generateTagGroup({ id: 5 }));
  const baseUrl = "/tag_groups/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<TagGroupsService>;
  const createService = createServiceFactory({
    service: TagGroupsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
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
