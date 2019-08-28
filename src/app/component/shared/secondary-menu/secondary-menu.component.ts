import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { SubSink } from "src/app/helpers/subsink/subsink";
import {
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
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
export class SecondaryMenuComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}

  subsink = new SubSink();
  contextLinks: List<NavigableMenuItem>;
  linksWidget: WidgetMenuItem;

  ngOnInit() {
    this.subsink.sink = this.route.data.subscribe((page: PageInfo) => {
      // get default links
      const defaultLinks = DefaultMenu.contextLinks;
      // and current page
      const current = page.self;

      // If page does not have a component, return early
      // This use case is only encountered by unit tests
      if (!current) {
        return;
      }

      // and parent pages
      const parentMenuRoutes: MenuRoute[] = [];
      let menuRoute = current;
      while (menuRoute.parent) {
        menuRoute = menuRoute.parent;
        parentMenuRoutes.push(menuRoute);
      }

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
      const allLinks = defaultLinks
        .concat(links, List<MenuRoute>(parentMenuRoutes), current)
        .sort(this.compare);

      if (!links.isEmpty) {
        console.log("Links menu found");
        console.log(links);
      }

      this.contextLinks = allLinks;
      this.linksWidget = linksWidget;
    });
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
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
