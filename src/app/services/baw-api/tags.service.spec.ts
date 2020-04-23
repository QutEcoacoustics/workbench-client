import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Tag } from "@models/Tag";
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
import { TagsService } from "./tags.service";

describe("TagsService", function () {
  beforeEach(async(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        TagsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });
    this.service = TestBed.inject(TagsService);
  }));

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Tag, TagsService>("/tags/");
  validateApiFilter<Tag, TagsService>("/tags/filter");
  validateApiShow<Tag, TagsService>("/tags/5", 5, new Tag({ id: 5 }));
  validateApiCreate<Tag, TagsService>("/tags/", new Tag({ id: 5 }));
  validateApiUpdate<Tag, TagsService>("/tags/5", new Tag({ id: 5 }));
  validateApiDestroy<Tag, TagsService>("/tags/5", 5, new Tag({ id: 5 }));
});
