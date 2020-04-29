import { Component } from "@angular/core";
import { AccountService } from "@baw-api/account.service";
import {
  adminCategory,
  adminDashboardMenuItem,
  adminUserListMenuItem,
} from "@component/admin/admin.menus";
import { adminMenuItemActions } from "@component/admin/dashboard/dashboard.component";
import {
  theirEditMenuItem,
  theirProfileMenuItem,
} from "@component/profile/profile.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { List } from "immutable";

@Page({
  category: adminCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions,
    ]),
    links: List(),
  },
  self: adminUserListMenuItem,
})
@Component({
  selector: "app-admin-users",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class AdminUserListComponent extends PagedTableTemplate<TableRow, User> {
  public userIcon = theirProfileMenuItem.icon;
  public columns = [
    { name: "Account" },
    { name: "User" },
    { name: "Last Login" },
    { name: "Confirmed" },
  ];
  public sortKeys = {
    user: "userName",
    lastLogin: "lastSeenAt",
  };
  public filterKey = "userName";

  constructor(api: AccountService) {
    super(api, (accounts) =>
      accounts.map((account) => ({
        account,
        user: account.userName,
        lastLogin: account.lastSeenAt?.toRelative() || "?",
        confirmed: account.isConfirmed,
      }))
    );
  }

  /**
   * Return the user redirect path.
   * This is outside the HTML file for static compiler analysis
   * @param user User account
   */
  public viewPath(user: User) {
    return user.viewUrl;
  }

  /**
   * Produce the router path to the edit their account page
   * @param user User Account
   */
  public editPath(user: User) {
    return theirEditMenuItem.route
      .toString()
      .replace(":accountId", user.id.toString());
  }
}

interface TableRow {
  account: User;
  user: string;
  lastLogin: string;
  confirmed: boolean;
}
