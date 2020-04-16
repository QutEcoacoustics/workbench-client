import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowSitesService } from "@baw-api/sites.service";
import { userResolvers } from "@baw-api/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  mySitesMenuItem,
} from "@component/profile/profile.menus";
import { annotationsMenuItem } from "@component/sites/sites.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountMenuItemActions } from "../profile/my-profile.component";

const accountKey = "account";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      myAccountMenuItem,
      ...myAccountMenuItemActions,
    ]),
    links: List(),
  },
  resolvers: {
    [accountKey]: userResolvers.show,
  },
  self: mySitesMenuItem,
})
@Component({
  selector: "app-my-account-sites",
  templateUrl: "./sites.component.html",
  styleUrls: ["./sites.component.scss"],
})
export class MySitesComponent extends PagedTableTemplate<TableRow, Site> {
  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    // TODO Add missing details
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site: {
            label: site.name,
            route: site.redirectPath(),
          },
          recentAudioUpload: "(none)",
          permission: "UNKNOWN",
          annotation: annotationsMenuItem.uri(undefined),
        })),
      route
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }
}

interface TableRow {
  // name: Site
  site: {
    label: string;
    route: string;
  };
  recentAudioUpload: string;
  permission: string;
  annotation: string;
}
