import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TagGroup } from "@models/TagGroup";
import { testAppInitializer } from "src/app/test.helper";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { TagGroupService } from "./tag-group.service";

describe("TagGroupService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TagGroupService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });
    this.service = TestBed.inject(TagGroupService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<TagGroup, TagGroupService>("/tag_groups/");
  validateApiFilter<TagGroup, TagGroupService>("/tag_groups/filter");
  validateApiShow<TagGroup, TagGroupService>(
    "/tag_groups/5",
    5,
    new TagGroup({ id: 5 })
  );
  validateApiCreate<TagGroup, TagGroupService>(
    "/tag_groups/",
    new TagGroup({ id: 5 })
  );
  validateApiUpdate<TagGroup, TagGroupService>(
    "/tag_groups/5",
    new TagGroup({ id: 5 })
  );
  validateApiDestroy<TagGroup, TagGroupService>(
    "/tag_groups/5",
    5,
    new TagGroup({ id: 5 })
  );
});
