import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateBookmark } from "@test/fakes/Bookmark";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler, assertRoute } from "@test/helpers/html";
import { BehaviorSubject } from "rxjs";
import { MyBookmarksComponent } from "./my-bookmarks.component";

describe("MyBookmarksComponent", () => {
  let api: SpyObject<BookmarksService>;
  let defaultUser: User;
  let defaultBookmark: Bookmark;
  let spec: SpectatorRouting<MyBookmarksComponent>;
  const createComponent = createRoutingFactory({
    component: MyBookmarksComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  function setup(model: User, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { user: "resolver" },
        user: { model, error },
      },
    });
    api = spec.inject(BookmarksService);
  }

  function interceptRequest(bookmarks: Bookmark[]) {
    bookmarks?.forEach((bookmark) => {
      bookmark.addMetadata({
        paging: {
          page: 1,
          items: defaultApiPageSize,
          total: 1,
          maxPage: 1,
        },
      });
    });

    api.filter.and.callFake(() => new BehaviorSubject(bookmarks));
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    defaultBookmark = new Bookmark(generateBookmark());
  });

  it("should create", () => {
    setup(defaultUser);
    interceptRequest([]);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should display username in title", () => {
    setup(defaultUser);
    interceptRequest([]);
    spec.detectChanges();
    expect(spec.query("h1 small")).toHaveText(defaultUser.userName);
  });

  it("should handle user error", () => {
    setup(undefined, generateApiErrorDetails());
    interceptRequest([]);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  describe("table", () => {
    function getCells() {
      return spec.queryAll<HTMLDivElement>("datatable-body-cell");
    }

    describe("bookmark name", () => {
      it("should display bookmark name", () => {
        setup(defaultUser);
        interceptRequest([defaultBookmark]);
        spec.detectChanges();

        expect(getCells()[0]).toHaveText(defaultBookmark.name);
      });

      it("should display bookmark name link", () => {
        setup(defaultUser);
        interceptRequest([defaultBookmark]);
        spec.detectChanges();

        const link = getCells()[0].querySelector("a");
        assertRoute(link, defaultBookmark.viewUrl);
      });
    });

    it("should display category", () => {
      setup(defaultUser);
      interceptRequest([defaultBookmark]);
      spec.detectChanges();

      expect(getCells()[1]).toHaveText(defaultBookmark.category);
    });

    it("should display description", () => {
      setup(defaultUser);
      interceptRequest([defaultBookmark]);
      spec.detectChanges();

      expect(getCells()[2].querySelector("span").innerHTML).toContain(
        defaultBookmark.descriptionHtmlTagline
      );
    });
  });
});
