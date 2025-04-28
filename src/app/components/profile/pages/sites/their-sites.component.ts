import { Component } from "@angular/core";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import {
  theirProfileCategory,
  theirSitesMenuItem,
} from "@components/profile/profile.menus";
import { User } from "@models/User";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TitleCasePipe } from "@angular/common";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { TimeSinceComponent } from "@shared/datetime-formats/time-since/time-since.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { theirProfileActions } from "../profile/their-profile.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";
import { MySitesComponent } from "./my-sites.component";

const accountKey = "account";

/**
 * TODO List of sites is filtered incorrectly
 */
@Component({
  selector: "baw-their-sites",
  templateUrl: "./sites.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    UrlDirective,
    TimeSinceComponent,
    LoadingComponent,
    StrongRouteDirective,
    ErrorHandlerComponent,
    TitleCasePipe,
    IsUnresolvedPipe,
  ],
})
class TheirSitesComponent extends MySitesComponent {
  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirSitesComponent.linkToRoute({
  category: theirProfileCategory,
  pageRoute: theirSitesMenuItem,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
});

export { TheirSitesComponent };
