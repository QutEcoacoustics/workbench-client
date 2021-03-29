import { Component, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { assignSiteMenuItem } from "@components/projects/projects.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { Site } from "@models/Site";
import { List } from "immutable";
import { adminOrphansCategory, adminOrphansMenuItem } from "../orphans.menus";

@Component({
  selector: "baw-admin-orphans",
  templateUrl: "./list.component.html",
})
class AdminOrphansComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  public assignSitesLabel = assignSiteMenuItem.label;

  public constructor(api: ShallowSitesService) {
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
    this.sortKeys = { id: "id", site: "name" };
    this.getPageData();
  }

  protected apiAction(filters: Filters) {
    return (this.api as ShallowSitesService).orphanFilter(filters);
  }
}

AdminOrphansComponent.linkComponentToPageInfo({
  category: adminOrphansCategory,
  menus: {
    actions: List([adminDashboardMenuItem, ...adminMenuItemActions]),
  },
}).andMenuRoute(adminOrphansMenuItem);

export { AdminOrphansComponent };

interface TableRow {
  id: Id;
  site: string;
  model: Site;
}
