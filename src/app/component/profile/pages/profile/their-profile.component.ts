import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { ItemInterface } from "src/app/component/shared/items/item/item.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem, MenuLink } from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import {
  theirEditProfileMenuItem,
  theirProfileCategory,
  theirProfileMenuItem
} from "../../profile.menus";

@Page({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([
      theirEditProfileMenuItem,
      MenuLink({
        icon: ["fas", "globe-asia"],
        label: "Their Projects",
        uri: "BROKEN LINK",
        tooltip: () => "Projects they can access",
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "map-marker-alt"],
        label: "Their Sites",
        uri: "BROKEN LINK",
        tooltip: () => "Sites they can access",
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "bookmark"],
        label: "Their Bookmarks",
        uri: "BROKEN LINK",
        tooltip: () => "Bookmarks created by them",
        predicate: user => !!user
      }),
      MenuLink({
        icon: ["fas", "bullseye"],
        label: "Their Annotations",
        uri: "BROKEN LINK",
        tooltip: () => "Annotations created by them",
        predicate: user => !!user
      })
    ]),
    links: List()
  },
  self: theirProfileMenuItem
})
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class TheirProfileComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: APIErrorDetails;
  imageUrl: string;
  tags: ItemInterface[];
  thirdPerson = true;
  user: User;
  userStatistics: ItemInterface[];

  constructor(private api: UserService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getUserAccount(params.userId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (user: User) => {
          this.user = user;
          this.imageUrl = user.getImage(ImageSizes.large);
        },
        (err: APIErrorDetails) => {
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
