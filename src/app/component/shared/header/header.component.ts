import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import {
  isNavigableMenuItem,
  MenuLink,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import {
  Configuration,
  HeaderDropDownConvertedLink,
  isHeaderLink
} from "src/app/services/app-config/app-config.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { environment } from "src/environments/environment";
import { contactUsMenuItem } from "../../about/about.menus";
import { homeMenuItem } from "../../home/home.menus";
import { myAccountMenuItem } from "../../profile/profile.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  activeLink: string;
  collapsed: boolean;
  config: Configuration;
  headers: List<NavigableMenuItem | HeaderDropDownConvertedLink>;
  routes: any;
  title: string;
  user: User;
  userImage: string;

  isNavigableMenuItem = isNavigableMenuItem;

  constructor(
    private router: Router,
    private securityApi: SecurityService,
    private userApi: UserService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = "projects";
    this.title = environment.values.brand.name;
    this.routes = {
      home: homeMenuItem,
      login: loginMenuItem,
      register: registerMenuItem,
      profile: myAccountMenuItem
    };

    // Convert MultiLink.items from SingleLink interface to NavigableMenuItem interface
    this.headers = List([
      projectsMenuItem,
      ...this.retrieveHeaderLinks(),
      contactUsMenuItem
    ]);

    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(
      val => {
        if (val instanceof NavigationEnd) {
          this.toggleCollapse(true);
        }
      },
      err => {
        console.error("HeaderComponent: ", err);
      }
    );

    this.securityApi
      .getAuthTrigger()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => this.updateUser(),
        err => {}
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
    if (setState) {
      this.collapsed = setState;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  /**
   * Logout user
   * TODO Handle error by giving user a warning
   */
  logout() {
    this.securityApi
      .signOut()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: () => {},
        complete: () => {
          this.router.navigate([homeMenuItem.route.toString()]);
        }
      });
  }

  /**
   * Retrieve header links from app config
   */
  private retrieveHeaderLinks() {
    return environment.values.content.map(header => {
      if (!isHeaderLink(header)) {
        return {
          headerTitle: header.headerTitle,
          items: header.items.map(item => this.generateLink(item))
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
    if (this.securityApi.isLoggedIn()) {
      this.userApi
        .show()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (user: User) => {
            this.user = user;
            this.userImage = this.user.getImage(ImageSizes.small);
            this.ref.detectChanges();
          },
          (err: ApiErrorDetails) => {
            this.user = null;
            this.ref.detectChanges();
          }
        );
    } else {
      this.user = null;
      this.ref.detectChanges();
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
      uri: () => item.url
    });
  }
}
