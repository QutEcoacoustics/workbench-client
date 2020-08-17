import { Component, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { adminDashboardMenuItem } from "@component/admin/admin.menus";
import { adminMenuItemActions } from "@component/admin/dashboard/dashboard.component";
import { assignSiteMenuItem } from "@component/projects/projects.menus";
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

@Component({
  selector: "app-admin-orphans",
  templateUrl: "./list.component.html",
})
class AdminOrphansComponent extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  public assignSitesLabel = assignSiteMenuItem.label;

  constructor(api: ShallowSitesService) {
    super(api, (sites) =>
      sites.map((site) => ({
        id: site.id,
        site: site.name,
        model: site,
      }))
    );

    this.filterKey = "name";
  }

  public ngOnInit(): void {
    this.columns = [{ name: "Id" }, { name: "Site" }, { name: "Model" }];
    this.sortKeys = { id: "id", site: "siteId" };
    this.getPageData();
  }

  public detailsPath(site: Site): string {
    return adminOrphanMenuItem.route.format({ siteId: site.id });
  }

  protected apiAction(filters: Filters) {
    return (this.api as ShallowSitesService).orphanFilter(filters);
  }
}

AdminOrphansComponent.LinkComponentToPageInfo({
  category: adminOrphansCategory,
  menus: {
    actions: List<AnyMenuItem>([
      adminDashboardMenuItem,
      ...adminMenuItemActions,
    ]),
  },
}).AndMenuRoute(adminOrphansMenuItem);

export { AdminOrphansComponent };

interface TableRow {
  id: Id;
  site: string;
  model: Site;
}
