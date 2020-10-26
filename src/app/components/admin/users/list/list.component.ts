import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
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
import { PagedTableTemplateV2 } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { IUser, User } from "@models/User";
import { List } from "immutable";

@Component({
  selector: "baw-admin-users",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
class AdminUserListComponent
  extends PagedTableTemplateV2<IUser, User>
  implements OnInit {
  @ViewChild("confirmed", { static: true })
  public confirmedTemplate: TemplateRef<any>;
  @ViewChild("action", { static: true })
  public actionTemplate: TemplateRef<any>;

  public userIcon = theirProfileMenuItem.icon;

  constructor(api: AccountsService, private ref: ChangeDetectorRef) {
    super(api, [
      {
        key: "user",
        name: "User",
        sortKey: "userName",
        isFilterKey: true,
        transform: (model) => model.userName,
      },
      {
        key: "lastLogin",
        name: "Last Login",
        sortKey: "lastSeenAt",
        width: 125,
        transform: (model) => model.lastSeenAt?.toRelative() ?? "?",
      },
      {
        key: "confirmed",
        name: "Confirmed",
        width: 90,
        cellTemplate: () => this.confirmedTemplate,
        transform: (model) => model.isConfirmed,
      },
      {
        key: "actions",
        name: "Actions",
        width: 125,
        cellTemplate: () => this.actionTemplate,
        transform: (model) => model,
      },
    ]);
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

AdminUserListComponent.LinkComponentToPageInfo({
  category: adminCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminUserListMenuItem);

export { AdminUserListComponent };
