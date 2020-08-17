import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
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
} from "@component/profile/profile.menus";
import { projectsMenuItem } from "@component/projects/projects.menus";
import { siteMenuItem } from "@component/sites/sites.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { ItemInterface } from "@shared/items/item/item.component";
import { List } from "immutable";

export const theirProfileActions = [
  theirEditMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem,
  theirBookmarksMenuItem,
  theirAnnotationsMenuItem,
];

const accountKey = "account";

@Component({
  selector: "app-their-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
class TheirProfileComponent extends PageComponent implements OnInit {
  public lastSeenAt: string;
  public tags: Tag[];
  public thirdPerson = true;
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

  public ngOnInit() {
    const accountModel: ResolvedModel<User> = this.route.snapshot.data[
      accountKey
    ];

    if (accountModel.error) {
      return;
    }

    this.user = accountModel.model;
    this.lastSeenAt = this.user.lastSeenAt
      ? this.user.lastSeenAt.toRelative()
      : "Unknown time since last logged in";

    this.projectsApi.filterByAccessLevel({}, this.user).subscribe(
      (models) => this.extractTotal(0, models),
      () => this.handleError(0)
    );

    this.tagsApi.filterByCreator({}, this.user).subscribe(
      (models) => {
        this.extractTotal(1, models);
        // TODO Extract tags by order of popularity https://github.com/QutEcoacoustics/baw-server/issues/449
        this.tags = models;
      },
      () => this.handleError(0)
    );

    this.bookmarksApi.filterByCreator({}, this.user).subscribe(
      (models) => this.extractTotal(2, models),
      () => this.handleError(0)
    );

    this.sitesApi.filterByAccessLevel({}, this.user).subscribe(
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

TheirProfileComponent.LinkComponentToPageInfo({
  category: theirProfileCategory,
  menus: { actions: List<AnyMenuItem>(theirProfileActions) },
  resolvers: { [accountKey]: accountResolvers.show },
}).AndMenuRoute(theirProfileMenuItem);

export { TheirProfileComponent };
