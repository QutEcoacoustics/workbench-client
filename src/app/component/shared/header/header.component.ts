import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import {
  isNavigableMenuItem,
  MenuLink,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { User } from "src/app/models/User";
import {
  AppConfigService,
  HeaderDropDownConvertedLink
} from "src/app/services/app-config/app-config.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { contactUsMenuItem } from "../../about/about.menus";
import { homeMenuItem } from "../../home/home.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeLink: string;
  collapsed: boolean;
  config: any;
  headers: List<NavigableMenuItem | HeaderDropDownConvertedLink>;
  loggedIn: boolean;
  subSink: SubSink = new SubSink();
  title: string;
  user: User;
  userImage: string;

  isNavigableMenuItem = isNavigableMenuItem;

  routes: any;

  constructor(
    private router: Router,
    private securityApi: SecurityService,
    private userApi: UserService,
    private appConfig: AppConfigService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = "projects";
    this.config = this.appConfig.getConfig();
    this.title = this.config.values.brand.name;
    this.routes = {
      home: homeMenuItem,
      login: loginMenuItem,
      register: registerMenuItem,
      profile: {
        url: "http://INTENTIONALLY_BROKEN_LINK/"
      }
    };

    // Convert MultiLink.items from SingleLink interface to NavigableMenuItem interface
    this.headers = List([
      projectsMenuItem,
      ...this.config.values.content.map(header => {
        if (header.headerTitle) {
          return {
            headerTitle: header.headerTitle,
            items: header.items.map(item => this.generateLink(item))
          } as HeaderDropDownConvertedLink;
        } else {
          return this.generateLink(header);
        }
      }),
      contactUsMenuItem
    ]);

    this.subSink.sink = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.toggleCollapse(true);
      }
    });

    this.subSink.sink = this.securityApi
      .getLoggedInTrigger()
      .subscribe(loggedIn => {
        this.subSink.sink = this.userApi.getMyAccount().subscribe(
          user => {
            this.user = user;

            // Find the small icon for the user
            if (this.user) {
              this.userImage = this.user.getImage(ImageSizes.small);
            }

            this.ref.detectChanges();
          },
          () => {
            this.user = null;

            // If the user is logged in, but the retrieval failed. Log them out
            if (loggedIn) {
              this.securityApi.signOut().subscribe();
            }

            this.ref.detectChanges();
          }
        );
      });
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private generateLink(item): MenuLink {
    return {
      kind: "MenuLink",
      label: item.title,
      uri: item.url
    } as MenuLink;
  }

  /**
   * Check if navbar link is active
   * @param link Navbar link
   * @returns True if navbar is active
   */
  isActive(link: string): boolean {
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
   * Toggle the collapse of a dropdown element
   * @param el Dropdown element
   */
  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle("show");
  }

  /**
   * Logout user
   * TODO Handle error by giving user a warning
   */
  logout() {
    this.securityApi.signOut().subscribe({
      error: () => {},
      complete: () => {
        this.router.navigate([""]);
      }
    });
  }
}
