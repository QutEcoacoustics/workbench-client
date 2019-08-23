import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageInfo } from "src/app/interfaces/pageInfo";
import { DefaultMenu } from "src/app/services/layout-menus/defaultMenus";
import { WidgetMenuItem } from "../widget/widgetItem";

@Component({
  selector: "app-secondary-menu",
  template: `
    <app-menu
      [links]="contextLinks"
      [widget]="linksWidget"
      [menuType]="'secondary'"
    >
    </app-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryMenuComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  contextLinks: List<NavigableMenuItem>;
  linksWidget: WidgetMenuItem;

  ngOnInit() {
    this.route.data.subscribe((page: PageInfo) => {
      // get default links
      const defaultLinks = DefaultMenu.contextLinks;
      // and current page
      const current = page.self;
      // with any links from route
      const links =
        page && page.menus && page.menus.links
          ? page.menus.links
          : List<NavigableMenuItem>();
      const linksWidget =
        page && page.menus && page.menus.actions
          ? page.menus.linksWidget
          : null;

      // and add it all together
      const allLinks = defaultLinks.concat(links, current).sort(this.compare);

      if (!links.isEmpty) {
        console.log("Links menu found");
        console.log(links);
      }

      this.contextLinks = allLinks;
      this.linksWidget = linksWidget;
    });
  }

  /**
   * Sort function for list of menu items
   * @param a First menu item
   * @param b Second menu item
   */
  compare(a: NavigableMenuItem, b: NavigableMenuItem): number {
    // If a does not have an order number, select b
    if (!a.order || !a.order.priority) {
      return 1;
    }

    // If b does not have an order number, select a
    if (!b.order || !b.order.priority) {
      return -1;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order.priority === b.order.priority) {
      if (a.order.indentation === b.order.indentation) {
        return a.label < b.label ? -1 : 1;
      }

      return a.order.indentation < b.order.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return a.order.priority < b.order.priority ? -1 : 1;
  }
}
