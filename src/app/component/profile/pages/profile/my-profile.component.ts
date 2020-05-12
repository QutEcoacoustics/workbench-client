import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModel } from "@baw-api/resolver-common";
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
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
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
export class MyProfileComponent extends PageComponent implements OnInit {
  public imageUrl: string;
  public tags: ItemInterface[];
  public thirdPerson = false;
  public user: User;
  public userStatistics: ItemInterface[];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const userModel: ResolvedModel<User> = this.route.snapshot.data[userKey];

    if (userModel.error) {
      return;
    }

    this.user = userModel.model;
    this.imageUrl = this.user.getImage(ImageSizes.large);

    this.userStatistics = [
      { icon: ["fas", "globe-asia"], name: "Projects", value: "Unknown" },
      { icon: ["fas", "tags"], name: "Tags", value: "Unknown" },
      { icon: ["fas", "bookmark"], name: "Bookmarks", value: "Unknown" },
      { icon: ["fas", "map-marker-alt"], name: "Sites", value: "Unknown" },
      { icon: ["fas", "bullseye"], name: "Annotations", value: "Unknown" },
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
