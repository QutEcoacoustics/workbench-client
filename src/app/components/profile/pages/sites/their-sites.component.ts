import { Component } from "@angular/core";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirSitesMenuItem,
} from "@components/profile/profile.menus";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";
import { MySitesComponent } from "./my-sites.component";

const accountKey = "account";

@Component({
  selector: "baw-their-sites",
  templateUrl: "./sites.component.html",
})
class TheirSitesComponent extends MySitesComponent {
  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirSitesComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: { actions: List([theirProfileMenuItem, ...theirProfileActions]) },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirSitesMenuItem);

export { TheirSitesComponent };
