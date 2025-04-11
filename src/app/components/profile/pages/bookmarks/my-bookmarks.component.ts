import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myBookmarksMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Bookmark } from "@models/Bookmark";
import { User } from "@models/User";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { myAccountActions } from "../profile/my-profile.component";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { ErrorHandlerComponent } from "../../../shared/error-handler/error-handler.component";

const userKey = "user";

@Component({
    selector: "baw-my-bookmarks",
    templateUrl: "./bookmarks.component.html",
    imports: [NgxDatatableModule, DatatableDefaultsDirective, UrlDirective, ErrorHandlerComponent]
})
class MyBookmarksComponent extends PagedTableTemplate<TableRow, Bookmark> {
  public api: BookmarksService;
  public columns = [
    { name: "Bookmark" },
    { name: "Category" },
    { name: "Description" },
  ];

  public constructor(api: BookmarksService, route: ActivatedRoute) {
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

MyBookmarksComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: myBookmarksMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MyBookmarksComponent };

interface TableRow {
  bookmark: Bookmark;
  category: string;
  description: string;
}
