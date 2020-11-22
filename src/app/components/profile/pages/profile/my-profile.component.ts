import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { userResolvers } from "@baw-api/user/user.service";
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
import { siteMenuItem } from "@components/sites/sites.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { ItemInterface } from "@shared/items/item/item.component";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

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
  public lastSeenAt: string;
  public tags: Tag[];
  public thirdPerson = false;
  public user: User;
  public userStatistics: List<ItemInterface> = List([
    { icon: projectsMenuItem.icon, name: "Projects", value: "..." },
    { icon: ["fas", "tags"], name: "Tags", value: "..." },
    { icon: ["fas", "bookmark"], name: "Bookmarks", value: "..." },
    { icon: siteMenuItem.icon, name: "Sites", value: "..." },
    // TODO Implement
    { icon: ["fas", "bullseye"], name: "Annotations", value: "Unknown" },
  ]);

  public constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: ShallowSitesService,
    private tagsApi: TagsService,
    private bookmarksApi: BookmarksService
  ) {
    super();
  }

  public ngOnInit() {
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.lastSeenAt = this.user.lastSeenAt
      ? this.user.lastSeenAt.toRelative()
      : "Unknown time since last logged in";

    this.projectsApi
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(0, models),
        () => this.handleError(0)
      );

    this.tagsApi
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => {
          this.extractTotal(1, models);
          // TODO Extract tags by order of popularity https://github.com/QutEcoacoustics/baw-server/issues/449
          this.tags = models;
        },
        () => this.handleError(0)
      );

    this.bookmarksApi
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(2, models),
        () => this.handleError(0)
      );

    this.sitesApi
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (models) => this.extractTotal(3, models),
        () => this.handleError(3)
      );
  }

  private extractTotal(index: number, models: AbstractModel[]) {
    const total = models.length > 0 ? models[0].getMetadata().paging.total : 0;
    this.userStatistics = this.userStatistics.update(index, (statistic) => ({
      ...statistic,
      value: total,
    }));
  }

  private handleError(index: number) {
    this.userStatistics = this.userStatistics.update(index, (statistic) => ({
      ...statistic,
      value: "Unknown",
    }));
  }
}

MyProfileComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List<AnyMenuItem>(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myAccountMenuItem);

export { MyProfileComponent };
