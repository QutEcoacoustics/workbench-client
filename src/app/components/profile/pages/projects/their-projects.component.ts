import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirProjectsMenuItem,
} from "@components/profile/profile.menus";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";
import { MyProjectsComponent } from "./my-projects.component";

const accountKey = "account";

/**
 * TODO Permissions field does not show the correct users access level
 * TODO List of projects is filtered incorrectly
 */
@Component({
  selector: "baw-their-projects",
  templateUrl: "./projects.component.html",
})
class TheirProjectsComponent extends MyProjectsComponent {
  constructor(api: ProjectsService, route: ActivatedRoute) {
    super(api, route);
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirProjectsComponent.linkComponentToPageInfo({
  category: theirProfileCategory,
  menus: { actions: List([theirProfileMenuItem, ...theirProfileActions]) },
  resolvers: { [accountKey]: accountResolvers.show },
}).andMenuRoute(theirProjectsMenuItem);

export { TheirProjectsComponent };
