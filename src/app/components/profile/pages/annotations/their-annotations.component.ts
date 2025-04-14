import { Component } from "@angular/core";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import {
  theirAnnotationsMenuItem,
  theirProfileCategory,
} from "@components/profile/profile.menus";
import { IAudioEvent } from "@models/AudioEvent";
import { User } from "@models/User";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { TimeSinceComponent } from "@shared/datetime-formats/time-since/time-since.component";
import { UrlDirective } from "@directives/url/url.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { theirProfileActions } from "../profile/their-profile.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";
import { MyAnnotationsComponent } from "./my-annotations.component";

const accountKey = "user";

@Component({
  selector: "baw-their-annotations",
  templateUrl: "./annotations.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    LoadingComponent,
    TimeSinceComponent,
    UrlDirective,
    ErrorHandlerComponent,
    IsUnresolvedPipe,
  ],
})
class TheirAnnotationsComponent extends MyAnnotationsComponent {
  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters<IAudioEvent>) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirAnnotationsComponent.linkToRoute({
  category: theirProfileCategory,
  pageRoute: theirAnnotationsMenuItem,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
});

export { TheirAnnotationsComponent };
