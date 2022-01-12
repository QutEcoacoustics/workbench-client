import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters } from "@baw-api/baw-api.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SecurityService } from "@baw-api/security/security.service";
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
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { ConfigService } from "@services/config/config.service";
import { IItem } from "@shared/items/item/item.component";
import { List } from "immutable";
import { Observable } from "rxjs";
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
  implements OnInit
{
  public dataRequest = dataRequestMenuItem.route;
  public lastSeenAt: string;
  public membershipLength: string;
  public tags: Tag[];
  public thirdPerson = false;
  public user: User;
  public isShowingAuthToken = false;
  public authToken: string;
  public userStatistics: List<IItem> = List([
    {
      icon: projectsMenuItem.icon,
      name: "Projects",
      tooltip: () => `Number of projects ${this.user.userName} has created`,
      value: "…",
    },
    // TODO Update icon
    {
      icon: adminTagsMenuItem.icon,
      name: "Tags",
      tooltip: () => `Number of tags ${this.user.userName} has created`,
      value: "…",
    },
    {
      icon: myBookmarksMenuItem.icon,
      name: "Bookmarks",
      tooltip: () => `Number of bookmarks ${this.user.userName} has created`,
      value: "…",
    },
    {
      icon: mySitesMenuItem.icon,
      name: "Sites",
      tooltip: () => `Number of sites ${this.user.userName} has created`,
      value: "…",
    },
    {
      icon: pointMenuItem.icon,
      name: "Points",
      tooltip: () => `Number of points ${this.user.userName} has created`,
      value: "…",
    },
    {
      icon: myAnnotationsMenuItem.icon,
      name: "Annotations",
      tooltip: () => `Number of annotations ${this.user.userName} has created`,
      value: "…",
    },
  ]);

  public constructor(
    public config: ConfigService,
    protected route: ActivatedRoute,
    protected audioEventsApi: ShallowAudioEventsService,
    protected bookmarksApi: BookmarksService,
    protected projectsApi: ProjectsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService,
    protected securityApi?: SecurityService
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

    this.securityApi
      ?.sessionDetails()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((session) => (this.authToken = session.authToken));
  }

  public toggleAuthTokenVisibility(): void {
    this.isShowingAuthToken = !this.isShowingAuthToken;
  }

  public get authTokenDescription(): string {
    return (
      `Use this code to interact with ${this.config.settings.brand.long}. ` +
      "Tools will ask you for auth token when they need one, copy the text below and paste it where needed. " +
      "Treat this code like your password, don't share it with anyone!"
    );
  }

  /** Update user details */
  protected updateUserProfile(user: User) {
    this.lastSeenAt =
      user.lastSeenAt?.toRelative() || "Unknown time since last logged in";
    this.membershipLength =
      user.createdAt?.toRelative() || "Unknown membership length";
  }

  /** Retrieve user statistics and update page */
  protected updateStatistics(user: User) {
    const projects = 0;
    const tags = 1;
    const bookmarks = 2;
    const sites = 3;
    const points = 4;
    const annotations = 5;

    this.updateStatistic(this.projectsApi, projects, user);
    this.updateStatistic<Tag, TagsService>(
      this.tagsApi,
      tags,
      user,
      {
        paging: { items: 10 },
        sorting: { orderBy: "updatedAt", direction: "desc" },
      },
      (models) => (this.tags = models)
    );
    this.updateStatistic(this.bookmarksApi, bookmarks, user);
    this.updateStatistic(this.sitesApi, sites, user);
    this.updateStatistic<Site, ShallowSitesService>(
      this.sitesApi,
      points,
      user,
      { filter: { regionId: { notEqual: null } } }
    );
    this.updateStatistic(this.audioEventsApi, annotations, user);
  }

  /** Update an individual statistic */
  protected updateStatistic<Model, S extends Service<Model>>(
    api: S,
    index: number,
    user: User,
    additionalFilters: Filters<Model> = {},
    callback?: (models: Model[]) => void
  ): void {
    function getPageTotal(model: Model) {
      return (model as unknown as AbstractModel).getMetadata().paging.total;
    }

    api
      .filterByCreator(additionalFilters, user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
          const total = models.length > 0 ? getPageTotal(models[0]) : 0;
          this.userStatistics = this.userStatistics.update(
            index,
            (statistic) => ({ ...statistic, value: total })
          );
          callback?.(models);
        },
        () => this.handleError(index)
      );
  }

  /** Set failed statistic value to unknown */
  protected handleError(index: number) {
    this.userStatistics = this.userStatistics.update(index, (statistic) => ({
      ...statistic,
      value: "Unknown",
    }));
  }
}

interface Service<Model> {
  filterByCreator: (filters: Filters<Model>, user: User) => Observable<Model[]>;
}

MyProfileComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: myAccountMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MyProfileComponent };
