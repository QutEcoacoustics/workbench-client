import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import {
  theirBookmarksMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";

const accountKey = "user";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirBookmarksMenuItem,
})
@Component({
  selector: "app-their-profile-bookmarks",
  templateUrl: "./bookmarks.component.html",
  styleUrls: ["./bookmarks.component.scss"],
})
export class TheirBookmarksComponent extends PagedTableTemplate<
  TableRow,
  Bookmark
> {
  constructor(api: BookmarksService, route: ActivatedRoute) {
    super(
      api,
      (bookmarks) =>
        bookmarks.map((bookmark) => ({
          bookmark,
          category: bookmark.category,
          description: bookmark.description,
        })),
      route
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }
}

interface TableRow {
  bookmark: Bookmark;
  category: string;
  description: string;
}
