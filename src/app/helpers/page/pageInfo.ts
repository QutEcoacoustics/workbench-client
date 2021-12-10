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

export function isIPageInfo(data: Data): data is IPageInfo {
  return data.category && data.pageRoute;
}

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
  /** Stores modified menuRoute */
  pageRoute?: MenuRoute;
  fullscreen?: boolean;
  resolvers?: ResolverList;
  menus?: Menus;
}

/**
 * Page info class
 */
export class PageInfo implements IPageInfo {
  public pageRoute: MenuRoute;
  public component: Type<PageComponent>;
  public category: Category;
  public menus: Menus;
  public fullscreen: boolean;
  public resolvers: ResolverList;

  public constructor(args: IPageInfo) {
    if (!args.pageRoute) {
      console.warn("PageInfo must have a menuRoute", args);
      throw Error("PageInfo must have a menuRoute");
    }

    Object.assign(this, args);
    this.resolvers = args.resolvers ?? {};
  }

  public setComponent(target: Type<PageComponent>): void {
    this.component = target;
    this.route.pageComponent = target;
  }

  public get route(): StrongRoute & { pageComponent: Type<PageComponent> } {
    return this.pageRoute.route;
  }
}
