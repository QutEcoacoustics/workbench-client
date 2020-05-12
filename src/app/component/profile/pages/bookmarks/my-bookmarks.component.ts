import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myBookmarksMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
    links: List(),
  },
  resolvers: {
    [userKey]: userResolvers.show,
  },
  self: myBookmarksMenuItem,
})
@Component({
  selector: "app-my-bookmarks",
  templateUrl: "./bookmarks.component.html",
})
export class MyBookmarksComponent extends PagedTableTemplate<
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
    return this.models[userKey] as User;
  }
}

interface TableRow {
  bookmark: Bookmark;
  category: string;
  description: string;
}
