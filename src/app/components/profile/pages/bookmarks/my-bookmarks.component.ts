import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myBookmarksMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-bookmarks",
  templateUrl: "./bookmarks.component.html",
})
class MyBookmarksComponent extends PagedTableTemplate<TableRow, Bookmark> {
  public api: BookmarksService;
  public columns = [
    { name: "Bookmark" },
    { name: "Category" },
    { name: "Description" },
  ];

  constructor(api: BookmarksService, route: ActivatedRoute) {
    super(
      api,
      (bookmarks) =>
        bookmarks.map((bookmark) => ({
          bookmark,
          category: bookmark.category,
          description: bookmark.descriptionHtmlTagline,
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }
}

MyBookmarksComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myBookmarksMenuItem);

export { MyBookmarksComponent };

interface TableRow {
  bookmark: Bookmark;
  category: string;
  description: string;
}
