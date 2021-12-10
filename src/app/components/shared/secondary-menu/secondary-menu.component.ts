import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { MenuRoute, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { ConfigService } from "@services/config/config.service";
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
      menuType="secondary"
      [links]="links"
      [widgets]="widgets"
    ></baw-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryMenuComponent
  extends withUnsubscribe()
  implements OnInit
{
  public links: List<NavigableMenuItem | MenuModalWithoutAction>;
  public widgets: List<WidgetMenuItem>;
  private defaultLinks = defaultMenu.contextLinks;

  public constructor(
    private route: ActivatedRoute,
    private config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    this.defaultLinks = this.defaultLinks.add(
      this.config.settings.hideProjects
        ? shallowRegionsMenuItem
        : projectsMenuItem
    );

    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        // get current page
        const current = page.menuRoute;
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
        this.widgets = page.menus?.linkWidgets ?? null;
        this.links = this.defaultLinks.toList().concat(
          page.menus?.links ?? List(),
          List(parentMenuRoutes).reverse(), // List lineage correctly
          current
        );
      },
      (err: ApiErrorDetails) => console.error("SecondaryMenuComponent", err)
    );
  }
}
