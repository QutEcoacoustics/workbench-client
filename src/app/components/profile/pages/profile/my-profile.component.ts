import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { userResolvers } from "@baw-api/user/user.service";
import { adminTagsMenuItem } from "@components/admin/tags/tags.menus";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import {
  myAccountCategory,
  myAccountMenuItem,
  myAnnotationsMenuItem,
  myBookmarksMenuItem,
  myEditMenuItem,
  myProjectsMenuItem,
  mySitesMenuItem,
} from "@components/profile/profile.menus";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { ItemInterface } from "@shared/items/item/item.component";
import { List } from "immutable";

export const myAccountActions = [
  myEditMenuItem,
  myProjectsMenuItem,
  mySitesMenuItem,
  myBookmarksMenuItem,
  myAnnotationsMenuItem,
];

const userKey = "user";

@Component({
  selector: "baw-my-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
class MyProfileComponent
  extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public dataRequest = dataRequestMenuItem;
  public lastSeenAt: string;
  public membershipLength: string;
  public tags: Tag[];
  public thirdPerson = false;
  public user: User;
  public userStatistics: List<ItemInterface> = List([
    { icon: projectsMenuItem.icon, name: "Projects", value: "..." },
    // TODO Update icon
    { icon: adminTagsMenuItem.icon, name: "Tags", value: "..." },
    { icon: myBookmarksMenuItem.icon, name: "Bookmarks", value: "..." },
    { icon: mySitesMenuItem.icon, name: "Sites", value: "..." },
    { icon: pointMenuItem.icon, name: "Points", value: "..." },
    { icon: myAnnotationsMenuItem.icon, name: "Annotations", value: "..." },
  ]);
  protected indexes = {
    PROJECTS: 0,
    TAGS: 1,
    BOOKMARKS: 2,
    SITES: 3,
    POINTS: 4,
    ANNOTATIONS: 5,
  };

  constructor(
    protected route: ActivatedRoute,
    protected audioEventsApi: ShallowAudioEventsService,
    protected bookmarksApi: BookmarksService,
    protected projectsApi: ProjectsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService
  ) {
    super();
  }

  public ngOnInit() {
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.updateUserProfile(this.user);
    this.updateStatistics(this.user);
  }

  /**
   * Update user details
   * @param user User model
   */
  protected updateUserProfile(user: User) {
    this.lastSeenAt =
      user.lastSeenAt?.toRelative() || "Unknown time since last logged in";
    this.membershipLength =
      user.createdAt?.toRelative() || "Unknown membership length";
  }

  /**
   * Retrieve user statistics and update page
   * @param user User model
   */
  protected updateStatistics(user: User) {
    // Projects
    this.projectsApi.filterByCreator({}, user).subscribe(
      (models) => this.extractTotal(this.indexes.PROJECTS, models),
      () => this.handleError(this.indexes.PROJECTS)
    );

    // Bookmarks
    this.bookmarksApi.filterByCreator({}, user).subscribe(
      (models) => this.extractTotal(this.indexes.BOOKMARKS, models),
      () => this.handleError(this.indexes.BOOKMARKS)
    );

    // Sites
    this.sitesApi.filterByCreator({}, user).subscribe(
      (models) => this.extractTotal(this.indexes.SITES, models),
      () => this.handleError(this.indexes.SITES)
    );

    // Points
    this.sitesApi
      .filterByCreator({ filter: { regionId: { notEqual: null } } }, user)
      .subscribe(
        (models) => this.extractTotal(this.indexes.POINTS, models),
        () => this.handleError(this.indexes.POINTS)
      );

    // Annotations
    this.audioEventsApi.filterByCreator({}, user).subscribe(
      (models) => this.extractTotal(this.indexes.ANNOTATIONS, models),
      () => this.handleError(this.indexes.ANNOTATIONS)
    );

    // Tags
    this.tagsApi
      .filterByCreator(
        {
          paging: { items: 10 },
          sorting: { orderBy: "updatedAt", direction: "desc" },
        },
        user
      )
      .subscribe(
        (models) => {
          this.extractTotal(this.indexes.TAGS, models);
          this.tags = models;
        },
        () => this.handleError(this.indexes.TAGS)
      );
  }

  /**
   * Extract the maximum number of models a user has access to
   * @param index Statistic index in userStatistics array
   * @param models Model list
   */
  protected extractTotal(index: number, models: AbstractModel[]) {
    const total = models.length > 0 ? models[0].getMetadata().paging.total : 0;
    this.userStatistics = this.userStatistics.update(index, (statistic) => ({
      ...statistic,
      value: total,
    }));
  }

  /**
   * Set failed statistic value to unknown
   */
  protected handleError(index: number) {
    this.userStatistics = this.userStatistics.update(index, (statistic) => ({
      ...statistic,
      value: "Unknown",
    }));
  }
}

MyProfileComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myAccountMenuItem);

export { MyProfileComponent };
