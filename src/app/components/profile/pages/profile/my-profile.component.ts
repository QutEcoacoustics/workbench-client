import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
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
  myDeleteMenuItem,
  myEditMenuItem,
  myPasswordMenuItem,
  myProjectsMenuItem,
  mySitesMenuItem,
} from "@components/profile/profile.menus";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { pointMenuItem } from "@components/sites/points.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { ItemInterface } from "@shared/items/item/item.component";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

export const myAccountActions = [
  myEditMenuItem,
  myPasswordMenuItem,
  myDeleteMenuItem,
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
  extends withUnsubscribe(PageComponent)
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
    projects: 0,
    tags: 1,
    bookmarks: 2,
    sites: 3,
    points: 4,
    annotations: 5,
  };

  public constructor(
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
   *
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
   *
   * @param user User model
   */
  protected updateStatistics(user: User) {
    // Projects
    this.projectsApi
      .filterByCreator({}, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(this.indexes.projects, models),
        () => this.handleError(this.indexes.projects)
      );

    // Bookmarks
    this.bookmarksApi
      .filterByCreator({}, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(this.indexes.bookmarks, models),
        () => this.handleError(this.indexes.bookmarks)
      );

    // Sites
    this.sitesApi
      .filterByCreator({}, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(this.indexes.sites, models),
        () => this.handleError(this.indexes.sites)
      );

    // Points
    this.sitesApi
      .filterByCreator({ filter: { regionId: { notEqual: null } } }, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(this.indexes.points, models),
        () => this.handleError(this.indexes.points)
      );

    // Annotations
    this.audioEventsApi
      .filterByCreator({}, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(this.indexes.annotations, models),
        () => this.handleError(this.indexes.annotations)
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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
          this.extractTotal(this.indexes.tags, models);
          this.tags = models;
        },
        () => this.handleError(this.indexes.tags)
      );
  }

  /**
   * Extract the maximum number of models a user has access to
   *
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

MyProfileComponent.linkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
}).andMenuRoute(myAccountMenuItem);

export { MyProfileComponent };
