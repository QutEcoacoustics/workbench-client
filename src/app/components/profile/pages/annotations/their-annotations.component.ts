import { Component } from "@angular/core";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import {
  theirAnnotationsMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@components/profile/profile.menus";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { IAudioEvent } from "@models/AudioEvent";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";
import { MyAnnotationsComponent } from "./my-annotations.component";

const accountKey = "user";

@Component({
  selector: "baw-their-annotations",
  templateUrl: "./annotations.component.html",
})
class TheirAnnotationsComponent extends MyAnnotationsComponent {
  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters<IAudioEvent>) {
    return this.api.filterByCreator(filters, this.account.id);
  }
}

TheirAnnotationsComponent.linkComponentToPageInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
}).andMenuRoute(theirAnnotationsMenuItem);

export { TheirAnnotationsComponent };
