import { Component, OnInit, inject } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { assignSiteMenuItem } from "@components/projects/projects.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { Site } from "@models/Site";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { adminOrphansCategory, adminOrphansMenuItem } from "../orphans.menus";

@Component({
  selector: "baw-admin-orphans",
  templateUrl: "./list.component.html",
  imports: [
    DebouncedInputDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    UrlDirective,
    ErrorHandlerComponent,
  ],
})
class AdminOrphansComponent
  extends PagedTableTemplate<TableRow, Site>
  implements OnInit
{
  public assignSitesLabel = assignSiteMenuItem.label;

  public constructor() {
    const api = inject(ShallowSitesService);

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

AdminOrphansComponent.linkToRoute({
  category: adminOrphansCategory,
  pageRoute: adminOrphansMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminOrphansComponent };

interface TableRow {
  id: Id;
  site: string;
  model: Site;
}
