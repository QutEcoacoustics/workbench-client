import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  mySitesMenuItem,
} from "@component/profile/profile.menus";
import { siteAnnotationsMenuItem } from "@component/sites/sites.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "account";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
    links: List(),
  },
  resolvers: {
    [userKey]: userResolvers.show,
  },
  self: mySitesMenuItem,
})
@Component({
  selector: "app-my-sites",
  templateUrl: "./sites.component.html",
})
export class MySitesComponent extends PagedTableTemplate<TableRow, Site> {
  public columns = [
    { name: "Site" },
    { name: "Recent Audio Upload" },
    { name: "Permission" },
    { name: "Annotation" },
  ];

  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    // TODO Add missing details
    // https://github.com/QutEcoacoustics/baw-server/issues/438
    // https://github.com/QutEcoacoustics/baw-server/issues/406
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site,
          recentAudioUpload: "(none)",
          permission: "UNKNOWN",
          annotation: siteAnnotationsMenuItem.uri(undefined),
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }
}

interface TableRow {
  site: Site;
  recentAudioUpload: string;
  permission: string;
  annotation: string;
}
