import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { ItemInterface } from "src/app/component/shared/items/item/item.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import {
  theirAnnotationsMenuItem,
  theirBookmarksMenuItem,
  theirEditProfileMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem
} from "../../profile.menus";

export const theirProfileMenuItemActions = [
  theirEditProfileMenuItem,
  theirProjectsMenuItem,
  theirSitesMenuItem,
  theirBookmarksMenuItem,
  theirAnnotationsMenuItem
];

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>(theirProfileMenuItemActions),
    links: List()
  },
  self: theirProfileMenuItem
})
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
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
    const userModel: ResolvedModel<User> = this.route.snapshot.data.account;

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
      { icon: ["fas", "comments"], name: "Comments", value: "Unknown" }
    ];

    this.tags = [
      {
        icon: ["fas", "tag"],
        name: "Test 1",
        value: 0,
        uri: () => "BROKEN LINK"
      },
      {
        icon: ["fas", "tag"],
        name: "Test 2",
        value: 0,
        uri: () => "BROKEN LINK"
      }
    ];
  }
}
