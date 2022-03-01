import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateTag } from "@test/fakes/Tag";
import {
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { TagsService } from "./tags.service";

describe("TagsService", (): void => {
  const createModel = () => new Tag(generateTag({ id: 5 }));
  const baseUrl = "/tags/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<TagsService>;
  const createService = createServiceFactory({
    service: TagsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Tag,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  validateCustomApiFilter<Tag, [IdOr<User>], TagsService>(
    () => spec,
    Tag,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  // TODO Add tests for tag types
});
