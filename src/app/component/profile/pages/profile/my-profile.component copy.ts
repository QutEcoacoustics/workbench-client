import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ItemInterface } from "src/app/component/shared/items/item/item.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem, MenuLink } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editMyAccountMenuItem,
  myAccountCategory,
  myAccountMenuItem
} from "../../profile.menus";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      editMyAccountMenuItem,
      MenuLink({
        icon: ["fas", "globe-asia"],
        label: "My Projects",
        uri: "BROKEN LINK",
        tooltip: user => `Projects ${user.userName} can access`,
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "map-marker-alt"],
        label: "My Sites",
        uri: "BROKEN LINK",
        tooltip: user => `Sites ${user.userName} can access`,
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "bookmark"],
        label: "My Bookmarks",
        uri: "BROKEN LINK",
        tooltip: user => `Bookmarks created by ${user.userName}`,
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "bullseye"],
        label: "My Annotations",
        uri: "BROKEN LINK",
        tooltip: user => `Annotations created by ${user.userName}`,
        predicate: user => !!user
      })
    ]),
    links: List()
  },
  self: myAccountMenuItem
})
@Component({
  selector: "app-my-account-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class MyProfileComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: ApiErrorDetails;
  imageUrl: string;
  tags: ItemInterface[];
  thirdPerson = false;
  user: User;
  userStatistics: ItemInterface[];

  constructor(private api: UserService) {
    super();
  }

  ngOnInit() {
    this.api
      .show()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.imageUrl = user.getImage(ImageSizes.large);
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );

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
        uri: "BROKEN LINK"
      },
      {
        icon: ["fas", "tag"],
        name: "Test 2",
        value: 0,
        uri: "BROKEN LINK"
      }
    ];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
