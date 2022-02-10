import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SecurityService } from "@baw-api/security/security.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { homeMenuItem } from "@components/home/home.menus";
import { libraryMenuItem } from "@components/library/library.menus";
import { listenMenuItem } from "@components/listen/listen.menus";
import { myAccountMenuItem } from "@components/profile/profile.menus";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import {
  loginMenuItem,
  registerMenuItem,
} from "@components/security/security.menus";
import { PartialWith } from "@helpers/advancedTypes";
import { CustomMenuItem } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MenuLink, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { SessionUser } from "@models/User";
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";

export type HeaderItem = PartialWith<MenuLink, "label" | "uri">;

export interface HeaderDropdown {
  label: string;
  items: HeaderItem[];
}

/**
 * Primary Menu Component.
 */
@Component({
  selector: "baw-primary-menu",
  templateUrl: "primary-menu.component.html",
  styleUrls: ["primary-menu.component.scss"],
})
export class PrimaryMenuComponent extends withUnsubscribe() implements OnInit {
  @Input() public isSideNav: boolean;

  public links: List<HeaderItem | HeaderDropdown | NavigableMenuItem>;
  public user: SessionUser;
  public routes = {
    admin: adminDashboardMenuItem,
    home: homeMenuItem,
    login: loginMenuItem,
    profile: myAccountMenuItem,
    register: registerMenuItem,
  };

  public constructor(
    public menu: MenuService,
    private api: SecurityService,
    private config: ConfigService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.setHeaderLinks();
    this.trackLoggedInState();
  }

  public isHeaderItem(
    item: HeaderItem | HeaderDropdown | NavigableMenuItem
  ): item is HeaderItem | NavigableMenuItem {
    return !this.isHeaderDropdown(item);
  }

  public isHeaderDropdown(
    item: HeaderItem | HeaderDropdown | NavigableMenuItem
  ): item is HeaderDropdown {
    return !!(item as HeaderDropdown).items;
  }

  /**
   * Logout user
   */
  public logout(): void {
    this.api
      .signOut()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err: ApiErrorDetails) => this.notifications.error(err.message),
        complete: () => {
          if (this.hasLocationGlobal()) {
            // If the location global class exists, use it to reload the page
            // Location may be undefined during SSR
            this.reloadPage();
          } else {
            // Else just redirect back to home
            this.router.navigateByUrl(homeMenuItem.route.toRouterLink());
          }
        },
      });
  }

  private setHeaderLinks() {
    this.links = List([
      this.config.settings.hideProjects
        ? shallowRegionsMenuItem
        : projectsMenuItem,
      listenMenuItem,
      libraryMenuItem,
      ...this.retrieveHeaderLinks(),
      contactUsMenuItem,
    ]);
  }

  private trackLoggedInState() {
    this.api
      .getAuthTrigger()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => (this.user = this.api.getLocalUser()),
        error: (err: ApiErrorDetails) => this.notifications.error(err.message),
      });
  }

  /**
   * Retrieve header links from app config
   */
  private retrieveHeaderLinks(): (HeaderItem | HeaderDropdown)[] {
    return this.config.settings.customMenu.map(
      (header): HeaderItem | HeaderDropdown => {
        if (header.items) {
          return {
            label: header.title,
            items: header.items.map((item) => this.generateLink(item)),
          };
        }
        return this.generateLink(header);
      }
    );
  }

  /**
   * Convert header item into a menulink object
   *
   * @param item Item to convert
   */
  private generateLink(item: CustomMenuItem): HeaderItem {
    return { label: item.title, uri: () => item.url };
  }

  /**
   * Determine if window.location is instantiated
   * ! This is extracted to a separate function so that tests can be performed.
   */
  private hasLocationGlobal(): boolean {
    return isInstantiated(location);
  }

  /**
   * Reload page.
   * ! This is extracted to a separate function so that tests can be performed.
   */
  private reloadPage(): void {
    location.reload();
  }
}
