import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
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
import { isDeletedUser, isUnknownUser, User } from "@models/User";
import { List } from "immutable";
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
  styleUrls: ["./profile.component.scss"],
})
class TheirProfileComponent extends MyProfileComponent implements OnInit {
  public thirdPerson = true;

  constructor(
    route: ActivatedRoute,
    audioEventsApi: ShallowAudioEventsService,
    bookmarksApi: BookmarksService,
    projectsApi: ProjectsService,
    sitesApi: ShallowSitesService,
    tagsApi: TagsService
  ) {
    super(route, audioEventsApi, bookmarksApi, projectsApi, sitesApi, tagsApi);
  }

  public ngOnInit() {
    const accountModel: ResolvedModel<User> = this.route.snapshot.data[
      accountKey
    ];

    if (accountModel.error) {
      return;
    }

    this.user = accountModel.model;
    this.updateUserProfile(this.user);

    if (isDeletedUser(this.user) || isUnknownUser(this.user)) {
      // Set statistics to unknown
      this.userStatistics.forEach((_, index) => this.handleError(index));
    } else {
      // Update statistics if user exists
      this.updateStatistics(this.user);
    }
  }
}

TheirProfileComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: { actions: List(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirProfileMenuItem);

export { TheirProfileComponent };
