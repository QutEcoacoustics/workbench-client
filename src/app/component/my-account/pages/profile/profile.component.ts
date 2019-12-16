import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { projectsMenuItem } from "src/app/component/projects/projects.menus";
import { ItemInterface } from "src/app/component/shared/items/items/items.component";
import { siteMenuItem } from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import { myAccountCategory, profileMenuItem } from "../../my-account.menus";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: profileMenuItem
})
@Component({
  selector: "app-profile",
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
      {
        icon: projectsMenuItem.icon,
        name: projectsMenuItem.label,
        value: "Unknown"
      },
      { icon: ["fas", "tags"], name: "Tags", value: "Unknown" },
      { icon: ["fas", "bookmark"], name: "Bookmarks", value: "Unknown" },
      { icon: siteMenuItem.icon, name: siteMenuItem.label, value: "Unknown" },
      { icon: ["fas", "comments"], name: "Comments", value: "Unknown" }
    ];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
