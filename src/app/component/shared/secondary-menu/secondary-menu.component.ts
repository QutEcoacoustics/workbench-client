import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DefaultMenu } from "@helpers/page/defaultMenus";
import { PageInfo } from "@helpers/page/pageInfo";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MenuRoute, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { WidgetMenuItem } from "../widget/widgetItem";

/**
 * Secondary Menu Component.
 * A menu on the left side of the page displaying easy access links
 * to variables root pages. It also displays a breadcrumb showing the
 * user the path they've taken.
 */
@Component({
  selector: "baw-secondary-menu",
  template: `
    <baw-menu
      [links]="contextLinks"
      [widget]="linksWidget"
      [menuType]="'secondary'"
    >
    </baw-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryMenuComponent extends WithUnsubscribe()
  implements OnInit {
  public contextLinks: List<NavigableMenuItem>;
  public linksWidget: WidgetMenuItem;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        // get default links
        const defaultLinks = DefaultMenu.contextLinks;

        // and current page
        const current = page.pageRoute;
        current.active = true; // Ignore predicate

        // and parent pages
        const parentMenuRoutes: MenuRoute[] = [];
        let menuRoute: MenuRoute = current;
        while (menuRoute.parent) {
          menuRoute = menuRoute.parent;
          menuRoute.active = true; // Ignore predicate

          parentMenuRoutes.push(menuRoute);
        }

        // with any links from route
        const links = page.menus?.links
          ? page.menus.links
          : List<NavigableMenuItem>();
        const linksWidget = page.menus?.linksWidget
          ? page.menus.linksWidget
          : null;

        // and add it all together
        const allLinks = defaultLinks.concat(
          links,
          List<MenuRoute>(parentMenuRoutes).reverse(), // List lineage correctly
          current
        );

        this.contextLinks = allLinks;
        this.linksWidget = linksWidget;
      },
      (err) => {}
    );
  }
}
