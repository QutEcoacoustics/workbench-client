import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import {
  theirBookmarksMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@components/profile/profile.menus";
import { IBookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";
import { MyBookmarksComponent } from "./my-bookmarks.component";

const accountKey = "account";

/**
 * TODO List of bookmarks is filtered incorrectly
 */
@Component({
  selector: "baw-their-bookmarks",
  templateUrl: "./bookmarks.component.html",
})
class TheirBookmarksComponent extends MyBookmarksComponent {
  constructor(api: BookmarksService, route: ActivatedRoute) {
    super(api, route);
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters<IBookmark>) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirBookmarksComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: { actions: List([theirProfileMenuItem, ...theirProfileActions]) },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirBookmarksMenuItem);

export { TheirBookmarksComponent };
