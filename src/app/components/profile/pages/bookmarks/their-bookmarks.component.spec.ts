import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { createRoutingFactory, SpectatorRouting, SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateBookmark } from "@test/fakes/Bookmark";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { BehaviorSubject } from "rxjs";
import { TheirBookmarksComponent } from "./their-bookmarks.component";

describe("TheirBookmarksComponent", () => {
  let api: SpyObject<BookmarksService>;
  let defaultUser: User;
  let defaultBookmark: Bookmark;
  let spec: SpectatorRouting<TheirBookmarksComponent>;
  const createComponent = createRoutingFactory({
    component: TheirBookmarksComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  assertPageInfo(TheirBookmarksComponent, "Bookmarks");

  function setup(model: User, error?: BawApiError) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { account: "resolver" },
        account: { model, error },
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

    api.filterByCreator.and.callFake(() => new BehaviorSubject(bookmarks));
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
    setup(undefined, generateBawApiError());
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
        expect(link).toHaveUrl(defaultBookmark.viewUrl);
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

      expect(getCells()[2].querySelector("span").innerHTML).toContain(defaultBookmark.descriptionHtmlTagline);
    });
  });
});
