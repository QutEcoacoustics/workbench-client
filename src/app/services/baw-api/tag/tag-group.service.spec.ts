import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";

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

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<TagGroup, TagGroupsService>("/tag_groups/");
  validateApiFilter<TagGroup, TagGroupsService>("/tag_groups/filter");
  validateApiShow<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    5,
    new TagGroup({ id: 5 })
  );
  validateApiCreate<TagGroup, TagGroupsService>(
    "/tag_groups/",
    new TagGroup({ id: 5 })
  );
  validateApiUpdate<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    new TagGroup({ id: 5 })
  );
  validateApiDestroy<TagGroup, TagGroupsService>(
    "/tag_groups/5",
    5,
    new TagGroup({ id: 5 })
  );
});
