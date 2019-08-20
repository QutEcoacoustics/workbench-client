import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { homeMenuItem } from "../../home/home.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  activeLink: string;
  collapsed: boolean;
  loggedIn: boolean;
  username: string;
  title = "Ecosounds";

  routes: {
    home: MenuRoute;
    login: MenuRoute;
    register: MenuRoute;
  };

  constructor(
    private router: Router,
    private api: SecurityService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = "projects";

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.toggleCollapse(true);
      }
    });

    this.routes = {
      home: homeMenuItem,
      login: loginMenuItem,
      register: registerMenuItem
    };

    if (this.api.isLoggedIn()) {
      this.username = this.api.getUser().username;
    }

    this.api.getLoggedInTrigger().subscribe(loggedIn => {
      this.username = loggedIn ? this.api.getUser().username : null;
      this.ref.detectChanges();
    });
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
   */
  logout() {
    this.api.signOut();
  }
}
