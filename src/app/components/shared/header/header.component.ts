import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SecurityService } from "@baw-api/security/security.service";
import { libraryMenuItem } from "@components/library/library.menus";
import { listenMenuItem } from "@components/listen/listen.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import {
  HeaderGroupConverted,
  HeaderLink,
  isHeaderLink,
} from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  isNavigableMenuItem,
  MenuLink,
  menuLink,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { SessionUser } from "@models/User";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { filter, takeUntil } from "rxjs/operators";
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
  public headers: List<NavigableMenuItem | HeaderGroupConverted>;
  public title: string;
  public user: SessionUser;
  public routes = {
    admin: adminDashboardMenuItem,
    home: homeMenuItem,
    login: loginMenuItem,
    profile: myAccountMenuItem,
    register: registerMenuItem,
  };
  public isNavigableMenuItem = isNavigableMenuItem;

  public constructor(
    private api: SecurityService,
    private config: ConfigService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit() {
    this.collapsed = true;
    this.title = this.config.settings.brand.short;

    // Convert MultiLink.items from SingleLink interface to NavigableMenuItem interface
    this.headers = List([
      this.config.settings.hideProjects
        ? shallowRegionsMenuItem
        : projectsMenuItem,
      listenMenuItem,
      libraryMenuItem,
      ...this.retrieveHeaderLinks(),
      contactUsMenuItem,
    ]);

    this.router.events
      .pipe(
        filter((val) => val instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => this.toggleCollapse(true),
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
   * Toggle the collapse of the navbar
   *
   * @param setState Set the state of the navbar
   */
  public toggleCollapse(setState?: boolean) {
    this.collapsed = setState ?? !this.collapsed;
  }

  /**
   * Logout user
   */
  public logout() {
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

  /**
   * Retrieve header links from app config
   */
  private retrieveHeaderLinks() {
    return this.config.settings.customMenu.map((header) => {
      if (isHeaderLink(header)) {
        return this.generateLink(header);
      }

      return {
        ...header,
        items: header.items.map((item) => this.generateLink(item)),
      } as HeaderGroupConverted;
    });
  }

  /**
   * Convert header item into a menulink object
   *
   * @param item Item to convert
   */
  private generateLink(item: HeaderLink): MenuLink {
    return menuLink({
      label: item.title,
      icon: ["fas", "home"],
      tooltip: () => "UPDATE ME",
      uri: () => item.url,
    });
  }

  /**
   * Determine if window.location is instantiated
   * ! This is extracted to a separate function so that tests can be performed.
   */
  private hasLocationGlobal() {
    return isInstantiated(location);
  }

  /**
   * Reload page.
   * ! This is extracted to a separate function so that tests can be performed.
   */
  private reloadPage() {
    location.reload();
  }
}
