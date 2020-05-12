import { Component, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { adminDashboardMenuItem } from "@component/admin/admin.menus";
import { adminMenuItemActions } from "@component/admin/dashboard/dashboard.component";
import { assignSiteMenuItem } from "@component/projects/projects.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Site } from "@models/Site";
import { List } from "immutable";
import {
  adminOrphanMenuItem,
  adminOrphansCategory,
  adminOrphansMenuItem,
} from "../orphans.menus";

@Page({
  category: adminOrphansCategory,
  menus: {
    links: List(),
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions,
    ]),
  },
  self: adminOrphansMenuItem,
})
@Component({
  selector: "app-admin-orphans",
  templateUrl: "./list.component.html",
})
export class AdminOrphansComponent extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  public filterKey = "name";
  public assignSitesLabel = assignSiteMenuItem.label;

  constructor(api: ShallowSitesService) {
    super(api, (sites) =>
      sites.map((site) => ({
        id: site.id,
        site: site.name,
        model: site,
      }))
    );
  }

  ngOnInit(): void {
    this.columns = [{ name: "Id" }, { name: "Site" }, { name: "Model" }];
    this.sortKeys = { id: "id", site: "siteId" };
    this.getPageData();
  }

  public detailsPath(site: Site): string {
    return adminOrphanMenuItem.route.format({ siteId: site.id });
  }

  protected apiAction(filters: Filters) {
    return (this.api as ShallowSitesService).orphans(filters);
  }
}

interface TableRow {
  id: Id;
  site: string;
  model: Site;
}
