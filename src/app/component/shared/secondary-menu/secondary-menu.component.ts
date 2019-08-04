import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavigableMenuItem } from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { List } from "immutable";
import { DefaultMenu } from "src/app/services/layout-menus/defaultMenus";

@Component({
  selector: "app-secondary-menu",
  templateUrl: "./secondary-menu.component.html",
  styleUrls: ["./secondary-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryMenuComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  contextLinks: List<NavigableMenuItem>;

  ngOnInit() {
    this.route.data.subscribe((val: PageInfo) => {
      // get default links
      const defaultLinks = DefaultMenu.contextLinks;
      // and current page
      const current = val;
      // with any links from route
      const links =
        val && val.menus && val.menus.links
          ? val.menus.links
          : List<NavigableMenuItem>();

      // and add it all together
      const allLinks = defaultLinks.concat(links, current).sort(this.compare);

      if (!links.isEmpty) {
        console.log("Links menu found");
        console.log(links);
      }

      this.contextLinks = allLinks;
    });
  }

  /**
   * Sort function for list of menu items
   * @param obj1 First menu item
   * @param obg2 Second menu item
   */
  compare(obj1: NavigableMenuItem, obj2: NavigableMenuItem): number {
    // If a does not have an order number, select b
    if (!obj1.order.priority) {
      return 1;
    }

    // If b does not have an order number, select a
    if (!obj2.order.priority) {
      return -1;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (obj1.order.priority === obj2.order.priority) {
      if (obj1.order.indentation === obj2.order.indentation) {
        return obj1.label < obj2.label ? -1 : 1;
      }

      return obj1.order.indentation < obj2.order.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return obj1.order.priority < obj2.order.priority ? -1 : 1;
  }
}
