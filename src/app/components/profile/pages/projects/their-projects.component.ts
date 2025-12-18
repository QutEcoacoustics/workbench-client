import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { Filters } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  theirProfileCategory,
  theirProjectsMenuItem,
} from "@components/profile/profile.menus";
import { User } from "@models/User";
import { List } from "immutable";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TitleCasePipe } from "@angular/common";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { theirProfileActions } from "../profile/their-profile.component";
import { MyProjectsComponent } from "./my-projects.component";

const accountKey = "account";

/**
 * TODO Permissions field does not show the correct users access level
 * TODO List of projects is filtered incorrectly
 */
@Component({
  selector: "baw-their-projects",
  templateUrl: "./projects.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    UrlDirective,
    ErrorHandlerComponent,
    TitleCasePipe,
  ],
})
class TheirProjectsComponent extends MyProjectsComponent {
  public constructor() {
    const api = inject(ProjectsService);
    const route = inject(ActivatedRoute);

    super(api, route);
  }

  public get account(): User {
    return this.models[accountKey] as User;
  }

  protected apiAction(filters: Filters) {
    return this.api.filterByCreator(filters, this.account);
  }
}

TheirProjectsComponent.linkToRoute({
  category: theirProfileCategory,
  pageRoute: theirProjectsMenuItem,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
});

export { TheirProjectsComponent };
