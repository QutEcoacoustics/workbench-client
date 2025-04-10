import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
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
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { MyProfileComponent } from "./my-profile.component";
import { AuthenticatedImageDirective } from "../../../../directives/image/image.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";
import { HiddenCopyComponent } from "../../../shared/hidden-copy/hidden-copy.component";
import { ItemsComponent } from "../../../shared/items/items/items.component";
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { UrlDirective } from "../../../../directives/url/url.directive";

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
    styleUrls: ["./profile.component.scss"],
    imports: [AuthenticatedImageDirective, FaIconComponent, NgbTooltip, StrongRouteDirective, HiddenCopyComponent, ItemsComponent, LoadingComponent, UrlDirective]
})
class TheirProfileComponent extends MyProfileComponent implements OnInit {
  public thirdPerson = true;

  public constructor(
    config: ConfigService,
    session: BawSessionService,
    route: ActivatedRoute,
    audioEventsApi: ShallowAudioEventsService,
    bookmarksApi: BookmarksService,
    projectsApi: ProjectsService,
    sitesApi: ShallowSitesService,
    tagsApi: TagsService
  ) {
    super(
      config,
      session,
      route,
      audioEventsApi,
      bookmarksApi,
      projectsApi,
      sitesApi,
      tagsApi
    );
  }

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
