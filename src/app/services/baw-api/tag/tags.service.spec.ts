import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Tag } from "@models/Tag";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";
import { TagsService } from "./tags.service";

describe("TagsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [TagsService],
    });
    this.service = TestBed.inject(TagsService);
  });

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
