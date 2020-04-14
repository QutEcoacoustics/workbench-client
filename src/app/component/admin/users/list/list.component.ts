import { Component, OnInit } from "@angular/core";
import { AccountService } from "@baw-api/account.service";
import {
  adminCategory,
  adminDashboardMenuItem,
  adminUserListMenuItem,
} from "@component/admin/admin.menus";
import { adminMenuItemActions } from "@component/admin/dashboard/dashboard.component";
import {
  theirEditProfileMenuItem,
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
export class AdminUserListComponent extends PagedTableTemplate<TableRow, User>
  implements OnInit {
  public userIcon = theirProfileMenuItem.icon;

  constructor(api: AccountService) {
    super(api, (accounts) =>
      accounts.map((account) => ({
        account,
        user: account.userName,
        lastLogin: account.lastSeenAt ? account.lastSeenAt.toRelative() : "?",
        confirmed: account.isConfirmed,
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [
      { name: "Account" },
      { name: "User" },
      { name: "Last Login" },
      { name: "Confirmed" },
    ];
    this.sortKeys = {
      user: "userName",
      lastLogin: "lastSeenAt",
    };
    this.filterKey = "userName";
    this.getModels();
  }

  /**
   * Return the user redirect path.
   * This is outside the HTML file for static compiler analysis
   * @param user User account
   */
  public viewPath(user: User) {
    return user.navigationPath();
  }

  /**
   * Produce the router path to the edit their account page
   * @param user User Account
   */
  public editPath(user: User) {
    return theirEditProfileMenuItem.route
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
