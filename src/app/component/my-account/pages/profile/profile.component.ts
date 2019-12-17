import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ItemInterface } from "src/app/component/shared/items/items/items.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  editProfileMenuItem,
  myAccountCategory,
  profileMenuItem
} from "../../my-account.menus";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([
      editProfileMenuItem,
      {
        kind: "MenuLink",
        icon: ["fas", "globe-asia"],
        label: "My Projects",
        uri: "BROKEN LINK",
        tooltip: user => `Projects ${user.userName} can access`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "map-marker-alt"],
        label: "My Sites",
        uri: "BROKEN LINK",
        tooltip: user => `Sites ${user.userName} can access`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bookmark"],
        label: "My Bookmarks",
        uri: "BROKEN LINK",
        tooltip: user => `Bookmarks created by ${user.userName}`,
        predicate: user => !!user
      },
      {
        kind: "MenuLink",
        icon: ["fas", "bookmark"],
        label: "My Annotations",
        uri: "BROKEN LINK",
        tooltip: user => `Annotations created by ${user.userName}`,
        predicate: user => !!user
      }
    ]),
    links: List()
  },
  self: profileMenuItem
})
@Component({
  selector: "app-my-account-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  errorCode: number;
  imageUrl: string;
  user: User;
  userStatistics: ItemInterface[];

  constructor(private api: UserService) {
    super();
  }

  ngOnInit() {
    this.api
      .getMyAccount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.imageUrl = user.getImage(ImageSizes.large);
        },
        (err: APIErrorDetails) => {
          this.errorCode = err.status;
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
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
