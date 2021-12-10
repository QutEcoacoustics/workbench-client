import { Type } from "@angular/core";
import { Data } from "@angular/router";
import {
  Category,
  MenuRoute,
  Menus,
  ResolverList,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { PageComponent } from "./pageComponent";

/**
 * Page info interface.
 * This stores information required to generate the various menus of the page.
 * Also stores metadata about the page, like the icon to use, and the route
 * for that page.
 *
 * @extends Data
 */
export interface IPageInfo extends Data {
  category?: Category;
  /** Stores modified menuroute */
  menuRoute?: MenuRoute;
  fullscreen?: boolean;
  resolvers?: ResolverList;
  menus?: Menus;
}

/**
 * Page info class
 */
export class PageInfo implements IPageInfo {
  public menuRoute: MenuRoute;
  public component: Type<PageComponent>;
  public category: Category;
  public menus: Menus;
  public fullscreen: boolean;
  public resolvers: ResolverList;

  public constructor(args: IPageInfo) {
    Object.assign(this, args);
    this.resolvers = args.resolvers ?? {};
  }

  public setComponent(target: Type<PageComponent>): void {
    this.component = target;
    this.route.pageComponent = target;
  }

  public get route(): StrongRoute {
    return this.menuRoute.route;
  }
}
