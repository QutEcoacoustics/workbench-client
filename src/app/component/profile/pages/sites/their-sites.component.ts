import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  theirProfileCategory,
  theirProfileMenuItem,
  theirSitesMenuItem,
} from "@component/profile/profile.menus";
import { siteAnnotationsMenuItem } from "@component/sites/sites.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";

const accountKey = "account";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirSitesMenuItem,
})
@Component({
  selector: "app-their-sites",
  templateUrl: "./sites.component.html",
})
export class TheirSitesComponent extends PagedTableTemplate<TableRow, Site> {
  public columns = [
    { name: "Site" },
    { name: "Recent Audio Upload" },
    { name: "Permission" },
    { name: "Annotation" },
  ];

  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    // TODO Add missing details https://github.com/QutEcoacoustics/baw-server/issues/406
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site,
          recentAudioUpload: "(fix_me)",
          permission: "FIX ME",
          annotation: siteAnnotationsMenuItem.uri(undefined),
        })),
      route
    );
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return (this.api as ShallowSitesService).filterByAccessLevel(
      filters,
      this.account
    );
  }
}

interface TableRow {
  site: Site;
  recentAudioUpload: string;
  permission: string;
  annotation: string;
}
