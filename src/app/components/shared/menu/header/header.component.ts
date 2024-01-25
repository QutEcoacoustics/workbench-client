import { Component } from "@angular/core";
import { homeMenuItem } from "@components/home/home.menus";
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";

/**
 * Header Component
 */
@Component({
  selector: "baw-header",
  template: `
    <nav id="navbar" class="fixed-top navbar navbar-expand navbar-dark">
      <!--
        Toggle button for secondary/action menus on large displays. Hide if menu
        layout on desktop viewports
      -->
      <baw-menu-toggle class="ps-3"></baw-menu-toggle>

      <div class="container">
        <!-- Brand Logo -->
        <a
          class="navbar-brand"
          strongRouteActive="active"
          [strongRoute]="homeMenuItem.route"
        >
          {{ config.settings.brand.short }}
        </a>

        <!-- Header Links, only visible on desktop viewports -->
        <baw-primary-menu class="flex-grow-1"></baw-primary-menu>

        <!--
          Because on desktop we have the website status indicator next to the user login/logout elements.
          The indicator will be hidden when the primary menu is hidden on mobile views.
          We therefore add another indicator when in mobile view so that there is always a warning indicator
          for a bad website status.
        -->
        <baw-website-status-indicator
          class="d-block d-lg-none"
        ></baw-website-status-indicator>
      </div>
    </nav>

    <!-- Displace header section of webpage -->
    <div style="height: 3.5rem"></div>
  `,
  styles: [
    `
      #navbar {
        background-color: var(--baw-header);
      }
    `,
  ],
})
export class HeaderComponent {
  public homeMenuItem = homeMenuItem;

  public constructor(public menu: MenuService, public config: ConfigService) {}
}
