import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { MockBawApiService } from "@baw-api/mock/baseApiMock.service";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { TagGroup } from "@models/TagGroup";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";

describe("TagGroupService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TagGroupsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
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
