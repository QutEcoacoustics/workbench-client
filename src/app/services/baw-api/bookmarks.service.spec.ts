import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Bookmark } from "@models/Bookmark";
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
import { BookmarksService } from "./bookmarks.service";
import { MockBawApiService } from "./mock/baseApiMock.service";

describe("BookmarksService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        BookmarksService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(BookmarksService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Bookmark, BookmarksService>("/bookmarks/");
  validateApiFilter<Bookmark, BookmarksService>("/bookmarks/filter");
  validateApiShow<Bookmark, BookmarksService>(
    "/bookmarks/5",
    5,
    new Bookmark({ id: 5 })
  );
  validateApiCreate<Bookmark, BookmarksService>(
    "/bookmarks/",
    new Bookmark({ id: 5 })
  );
  validateApiUpdate<Bookmark, BookmarksService>(
    "/bookmarks/5",
    new Bookmark({ id: 5 })
  );
  validateApiDestroy<Bookmark, BookmarksService>(
    "/bookmarks/5",
    5,
    new Bookmark({ id: 5 })
  );
});
