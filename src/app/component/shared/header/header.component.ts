import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import {
  HeaderDropDownConvertedLink,
  isHeaderLink,
} from "src/app/helpers/app-initializer/app-initializer";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import {
  isNavigableMenuItem,
  MenuLink,
  NavigableMenuItem,
} from "src/app/interfaces/menusInterfaces";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
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
export class HeaderComponent extends WithUnsubscribe() implements OnInit {
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
  public ImageSizes = ImageSizes;
  public isNavigableMenuItem = isNavigableMenuItem;

  constructor(
    private api: SecurityService,
    private env: AppConfigService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
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
        () => this.updateUser(),
        (err: ApiErrorDetails) => this.notifications.error(err.message)
      );
  }

  /**
   * Check if navbar link is active
   * @param link Navbar link
   * @returns True if navbar is active
   */
  isActive(link: string) {
    return this.activeLink.toLowerCase() === link.toLowerCase();
  }

  /**
   * Toggle the collapse of the navbar
   * @param setState Set the state of the navbar
   */
  toggleCollapse(setState?: boolean) {
    this.collapsed = setState ? setState : !this.collapsed;
  }

  /**
   * Logout user
   */
  logout() {
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
   * Update header user profile
   */
  private updateUser() {
    this.user = this.api.getLocalUser();

    if (!this.user) {
      return;
    }
  }

  /**
   * Convert header item into a menulink object
   * @param item Item to convert
   */
  private generateLink(item: any): MenuLink {
    return MenuLink({
      label: item.title,
      icon: ["fas", "home"],
      tooltip: () => "UPDATE ME",
      uri: () => item.url,
    });
  }
}
