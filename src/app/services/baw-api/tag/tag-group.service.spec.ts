import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateTagGroup } from "@test/fakes/TagGroup";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";

describe("TagGroupService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [TagGroupsService],
    });
    this.service = TestBed.inject(TagGroupsService);
  });

  validateApiList<TagGroup, TagGroupsService>("/tag_groups/");
  validateApiFilter<TagGroup, TagGroupsService>("/tag_groups/filter");
  validateApiShow<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    5,
    new TagGroup(generateTagGroup(5))
  );
  validateApiCreate<TagGroup, TagGroupsService>(
    "/tag_groups/",
    new TagGroup(generateTagGroup(5))
  );
  validateApiUpdate<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    new TagGroup(generateTagGroup(5))
  );
  validateApiDestroy<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    5,
    new TagGroup(generateTagGroup(5))
  );
});
