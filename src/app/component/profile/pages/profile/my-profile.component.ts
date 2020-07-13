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
} from "@component/profile/profile.menus";
import { projectsMenuItem } from "@component/projects/projects.menus";
import { siteMenuItem } from "@component/sites/sites.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
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

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>(myAccountActions),
    links: List(),
  },
  resolvers: {
    [userKey]: userResolvers.show,
  },
  self: myAccountMenuItem,
})
@Component({
  selector: "app-my-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class MyProfileComponent extends WithUnsubscribe(PageComponent)
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

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: ShallowSitesService,
    private tagsApi: TagsService,
    private bookmarksApi: BookmarksService
  ) {
    super();
  }

  ngOnInit() {
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.lastSeenAt = this.user.lastSeenAt
      ? this.user.lastSeenAt.toRelative()
      : "Unknown time since last logged in";

    this.projectsApi.list().subscribe(
      (models) => this.extractTotal(0, models),
      () => this.handleError(0)
    );

    this.tagsApi.list().subscribe(
      (models) => {
        this.extractTotal(1, models);
        // TODO Extract tags by order of popularity https://github.com/QutEcoacoustics/baw-server/issues/449
        this.tags = models;
      },
      () => this.handleError(0)
    );

    this.bookmarksApi.list().subscribe(
      (models) => this.extractTotal(2, models),
      () => this.handleError(0)
    );

    this.sitesApi.list().subscribe(
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
