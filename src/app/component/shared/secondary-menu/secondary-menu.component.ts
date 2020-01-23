import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo } from "src/app/helpers/page/pageInfo";
import {
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
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
  private unsubscribe = new Subject();
  contextLinks: List<NavigableMenuItem>;
  linksWidget: WidgetMenuItem;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (page: PageInfo) => {
        // get default links
        const defaultLinks = DefaultMenu.contextLinks;

        // and current page
        let indentation = 0;
        const current = page.self;

        // and parent pages
        const parentMenuRoutes: MenuRoute[] = [];
        let menuRoute = current;
        while (menuRoute.parent) {
          menuRoute = menuRoute.parent;
          parentMenuRoutes.push(menuRoute);
          indentation++;
        }

        if (current.order) {
          current.order.indentation = indentation;
        }

        parentMenuRoutes.forEach(parent => {
          indentation--;
          parent.order.indentation = indentation;
        });

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
          List<MenuRoute>(parentMenuRoutes),
          current
        );

        this.contextLinks = allLinks;
        this.linksWidget = linksWidget;
      },
      err => {}
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
