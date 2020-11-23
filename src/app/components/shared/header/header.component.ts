import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SecurityService } from "@baw-api/security/security.service";
import {
  HeaderDropDownConvertedLink,
  isHeaderLink,
} from "@helpers/app-initializer/app-initializer";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ImageSizes } from "@interfaces/apiInterfaces";
import {
  isNavigableMenuItem,
  MenuLink,
  menuLink,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { SessionUser } from "@models/User";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { contactUsMenuItem } from "../../about/about.menus";
import { adminDashboardMenuItem } from "../../admin/admin.menus";
import { homeMenuItem } from "../../home/home.menus";
import { myAccountMenuItem } from "../../profile/profile.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";

/**
 * Header Component
 */
@Component({
  selector: "baw-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends withUnsubscribe() implements OnInit {
  public activeLink: string;
  public collapsed: boolean;
  public headers: List<NavigableMenuItem | HeaderDropDownConvertedLink>;
  public title: string;
  public user: SessionUser;
  public routes = {
    admin: adminDashboardMenuItem,
    home: homeMenuItem,
    login: loginMenuItem,
    profile: myAccountMenuItem,
    register: registerMenuItem,
  };
  public thumbnail = ImageSizes.small;
  public isNavigableMenuItem = isNavigableMenuItem;

  public constructor(
    private api: SecurityService,
    private env: AppConfigService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit() {
    this.collapsed = true;
    this.activeLink = "projects";
    this.title = this.env.values.brand.name;

    // Convert MultiLink.items from SingleLink interface to NavigableMenuItem interface
    this.headers = List([
      projectsMenuItem,
      ...this.retrieveHeaderLinks(),
      contactUsMenuItem,
    ]);

    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(
      (val) => {
        if (val instanceof NavigationEnd) {
          this.toggleCollapse(true);
        }
      },
      (err) => console.error("HeaderComponent: ", err)
    );

    this.api
      .getAuthTrigger()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => (this.user = this.api.getLocalUser()),
        (err: ApiErrorDetails) => this.notifications.error(err.message)
      );
  }

  /**
   * Check if navbar link is active
   *
   * @param link Navbar link
   * @returns True if navbar is active
   */
  public isActive(link: string) {
    return this.activeLink.toLowerCase() === link.toLowerCase();
  }

  /**
   * Toggle the collapse of the navbar
   *
   * @param setState Set the state of the navbar
   */
  public toggleCollapse(setState?: boolean) {
    this.collapsed = setState ? setState : !this.collapsed;
  }

  /**
   * Logout user
   */
  public logout() {
    this.api
      .signOut()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err: ApiErrorDetails) => {
          this.notifications.error(err.message);
        },
        complete: () => {
          this.router.navigate([homeMenuItem.route.toString()]);
        },
      });
  }

  /**
   * Retrieve header links from app config
   */
  private retrieveHeaderLinks() {
    return this.env.values.content.map((header) => {
      if (!isHeaderLink(header)) {
        return {
          headerTitle: header.headerTitle,
          items: header.items.map((item) => this.generateLink(item)),
        } as HeaderDropDownConvertedLink;
      } else {
        return this.generateLink(header);
      }
    });
  }

  /**
   * Convert header item into a menulink object
   *
   * @param item Item to convert
   */
  private generateLink(item: any): MenuLink {
    return menuLink({
      label: item.title,
      icon: ["fas", "home"],
      tooltip: () => "UPDATE ME",
      uri: () => item.url,
    });
  }
}
