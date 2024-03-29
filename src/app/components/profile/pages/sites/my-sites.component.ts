import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { userResolvers } from "@baw-api/user/user.service";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import {
  myAccountCategory,
  mySitesMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { List } from "immutable";
import { DateTime } from "luxon";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-sites",
  templateUrl: "./sites.component.html",
})
class MySitesComponent extends PagedTableTemplate<TableRow, Site> {
  public columns = [
    { name: "Site" },
    { name: "Last Modified" },
    { name: "Permission" },
    { name: "Annotation" },
  ];
  public sortKeys = { site: "name", lastModified: "updatedAt" };
  public annotationLink = dataRequestMenuItem.route;
  protected api: ShallowSitesService;

  public constructor(api: ShallowSitesService, route: ActivatedRoute) {
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          site,
          lastModified: site.updatedAt,
          permission: site,
          annotation: site,
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }

  public hasViewUrl(site: Site): boolean {
    return site.projectIds.size > 0;
  }
}

MySitesComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: mySitesMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MySitesComponent };

interface TableRow {
  site: Site;
  lastModified: DateTime;
  permission: Site;
  annotation: Site;
}
