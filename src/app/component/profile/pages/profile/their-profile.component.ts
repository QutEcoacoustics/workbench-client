import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
} from "@component/profile/profile.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { ItemInterface } from "@shared/items/item/item.component";
import { List } from "immutable";

export const theirProfileMenuItemActions = [
  theirEditMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem,
  theirBookmarksMenuItem,
  theirAnnotationsMenuItem,
];

const accountKey = "account";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>(theirProfileMenuItemActions),
    links: List(),
  },
  resolvers: {
    [accountKey]: accountResolvers.show,
  },
  self: theirProfileMenuItem,
})
@Component({
  selector: "app-their-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class TheirProfileComponent extends PageComponent implements OnInit {
  public imageUrl: string;
  public tags: ItemInterface[];
  public thirdPerson = true;
  public user: User;
  public userStatistics: ItemInterface[];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const accountModel: ResolvedModel<User> = this.route.snapshot.data[
      accountKey
    ];

    if (accountModel.error) {
      return;
    }

    this.user = accountModel.model;
    this.imageUrl = this.user.getImage(ImageSizes.large);

    this.userStatistics = [
      { icon: ["fas", "globe-asia"], name: "Projects", value: "Unknown" },
      { icon: ["fas", "tags"], name: "Tags", value: "Unknown" },
      { icon: ["fas", "bookmark"], name: "Bookmarks", value: "Unknown" },
      { icon: ["fas", "map-marker-alt"], name: "Sites", value: "Unknown" },
      { icon: ["fas", "bullseye"], name: "Annotations", value: "Unknown" },
      { icon: ["fas", "comments"], name: "Comments", value: "Unknown" },
    ];

    this.tags = [
      {
        icon: ["fas", "tag"],
        name: "Test 1",
        value: 0,
        uri: () => "BROKEN LINK",
      },
      {
        icon: ["fas", "tag"],
        name: "Test 2",
        value: 0,
        uri: () => "BROKEN LINK",
      },
    ];
  }
}
