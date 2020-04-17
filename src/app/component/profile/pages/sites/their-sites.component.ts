import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account.service";
import { ShallowSitesService } from "@baw-api/sites.service";
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirSitesMenuItem,
} from "@component/profile/profile.menus";
import { annotationsMenuItem } from "@component/sites/sites.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileMenuItemActions } from "../profile/their-profile.component";

const accountKey = "account";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      theirProfileMenuItem,
      ...theirProfileMenuItemActions,
    ]),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirSitesMenuItem,
})
@Component({
  selector: "app-their-account-sites",
  templateUrl: "./sites.component.html",
  styleUrls: ["./sites.component.scss"],
})
export class TheirSitesComponent extends PagedTableTemplate<TableRow, Site> {
  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    // TODO Add missing details https://github.com/QutEcoacoustics/baw-server/issues/406
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site: {
            label: site.name,
            route: site.navigationPath(),
          },
          recentAudioUpload: "(none)",
          permission: "FIX ME",
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
