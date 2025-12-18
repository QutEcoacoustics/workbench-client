import { Component, OnInit } from "@angular/core";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import {
  theirAnnotationsMenuItem,
  theirBookmarksMenuItem,
  theirEditMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem,
} from "@components/profile/profile.menus";
import { User } from "@models/User";
import { List } from "immutable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { HiddenCopyComponent } from "@shared/hidden-copy/hidden-copy.component";
import { ItemsComponent } from "@shared/items/items/items.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { MyProfileComponent } from "./my-profile.component";

export const theirProfileActions = [
  theirEditMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem,
  theirBookmarksMenuItem,
  theirAnnotationsMenuItem,
];

const accountKey = "account";

@Component({
  selector: "baw-their-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
  imports: [
    AuthenticatedImageDirective,
    FaIconComponent,
    NgbTooltip,
    StrongRouteDirective,
    HiddenCopyComponent,
    ItemsComponent,
    LoadingComponent,
    UrlDirective,
  ],
})
class TheirProfileComponent extends MyProfileComponent implements OnInit {
  public thirdPerson = true;

  public ngOnInit() {
    const accountModel: ResolvedModel<User> =
      this.route.snapshot.data[accountKey];

    if (accountModel.error) {
      return;
    }

    this.user = accountModel.model;
    this.updateUserProfile(this.user);

    if (this.user.isGhost) {
      // Set statistics to unknown
      this.tags = [];
      this.userStatistics.forEach((_, index) => this.handleError(index));
    } else {
      // Update statistics if user exists
      this.updateStatistics(this.user);
    }
  }
}

TheirProfileComponent.linkToRoute({
  category: theirProfileCategory,
  pageRoute: theirProfileMenuItem,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
});

export { TheirProfileComponent };
