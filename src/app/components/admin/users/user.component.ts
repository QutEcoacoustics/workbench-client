import { Component } from "@angular/core";
import { AccountsService } from "@baw-api/account/accounts.service";
import {
  adminCategory,
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
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";

@Component({
  selector: "baw-admin-users",
  templateUrl: "./user.component.html",
  imports: [
    DebouncedInputDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    UrlDirective,
    StrongRouteDirective,
    ErrorHandlerComponent,
  ],
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
}

AdminUserListComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminUserListMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminUserListComponent };

interface TableRow {
  account: User;
  user: string;
  lastLogin: string;
  confirmed: boolean;
}
