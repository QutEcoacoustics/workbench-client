import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import {
  theirBookmarksMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@component/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";

const accountKey = "account";

@Component({
  selector: "app-their-bookmarks",
  templateUrl: "./bookmarks.component.html",
})
class TheirBookmarksComponent extends PagedTableTemplate<TableRow, Bookmark> {
  public sortKeys = { category: "category" };

  constructor(api: BookmarksService, route: ActivatedRoute) {
    super(
      api,
      (bookmarks) =>
        bookmarks.map((bookmark) => ({
          bookmark,
          category: bookmark.category,
          description: bookmark.description,
        })),
      route,
      (component: TheirBookmarksComponent) => [component.account]
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }
}

TheirBookmarksComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirBookmarksMenuItem);

export { TheirBookmarksComponent };

interface TableRow {
  bookmark: Bookmark;
  category: string;
  description: string;
}
