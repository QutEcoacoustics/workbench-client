import { Component } from "@angular/core";
import { AccountsService } from "@baw-api/account/accounts.service";
import {
  adminCategory,
  adminDashboardMenuItem,
  adminUserListMenuItem,
} from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import {
  theirEditMenuItem,
  theirProfileMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { User } from "@models/User";
import { List } from "immutable";

@Component({
  selector: "baw-admin-users",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
class AdminUserListComponent extends PagedTableTemplate<TableRow, User> {
  public userIcon = theirProfileMenuItem.icon;
  public columns = [
    { name: "Account" },
    { name: "User" },
    { name: "Last Login" },
    { name: "Confirmed" },
  ];
  public sortKeys = { user: "userName", lastLogin: "lastSeenAt" };
  public editPath = theirEditMenuItem.route;

  public constructor(api: AccountsService) {
    super(api, (accounts) =>
      accounts.map((account) => ({
        account,
        user: account.userName,
        lastLogin: account.lastSeenAt?.toRelative() ?? "?",
        confirmed: account.isConfirmed,
      }))
    );

    this.filterKey = "userName";
  }

  /**
   * Return the user redirect path.
   * This is outside the HTML file for static compiler analysis
   *
   * @param user User account
   */
  public viewPath(user: User) {
    return user.viewUrl;
  }
}

AdminUserListComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List([adminDashboardMenuItem, ...adminMenuItemActions]) },
}).andMenuRoute(adminUserListMenuItem);

export { AdminUserListComponent };

interface TableRow {
  account: User;
  user: string;
  lastLogin: string;
  confirmed: boolean;
}
