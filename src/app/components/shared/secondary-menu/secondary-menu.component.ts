import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MenuRoute, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { WidgetMenuItem } from "@menu/widgetItem";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

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
    ></baw-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryMenuComponent
  extends withUnsubscribe()
  implements OnInit {
  public contextLinks: List<NavigableMenuItem>;
  public linksWidget: WidgetMenuItem;
  private defaultLinks: List<NavigableMenuItem> = defaultMenu.contextLinks;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        // get current page
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

        // and add it all together
        this.linksWidget = page.menus?.linksWidget ?? null;
        this.contextLinks = this.defaultLinks.concat(
          page.menus?.links ?? List(),
          List(parentMenuRoutes).reverse(), // List lineage correctly
          current
        );
      },
      (err) => {}
    );
  }
}
