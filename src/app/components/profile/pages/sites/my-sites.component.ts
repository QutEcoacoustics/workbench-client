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
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { TimeSinceComponent } from "../../../shared/datetime-formats/time-since/time-since.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";
import { ErrorHandlerComponent } from "../../../shared/error-handler/error-handler.component";
import { TitleCasePipe } from "@angular/common";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

const userKey = "user";

@Component({
    selector: "baw-my-sites",
    templateUrl: "./sites.component.html",
    imports: [NgxDatatableModule, DatatableDefaultsDirective, UrlDirective, TimeSinceComponent, LoadingComponent, StrongRouteDirective, ErrorHandlerComponent, TitleCasePipe, IsUnresolvedPipe]
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
