import { Type } from "@angular/core";
import { Data } from "@angular/router";
import {
  Category,
  MenuRoute,
  Menus,
  ResolverList,
} from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "./pageComponent";

/**
 * Page info interface.
 * This stores information required to generate the various menus of the page.
 * Also stores metadata about the page, like the icon to use, and the route
 * for that page.
 * @extends Data
 */
export interface IPageInfo extends Data {
  category: Category;
  self?: MenuRoute & { pageComponent?: Type<PageComponent> };
  fullscreen?: boolean;
  resolvers?: ResolverList;
  menus?: Menus;
}

/**
 * Page info class
 */
export class PageInfo implements IPageInfo {
  public self: MenuRoute & { pageComponent?: Type<PageComponent> };
  public component: Type<PageComponent>;
  public category: Category;
  public menus: Menus;
  public fullscreen: boolean;
  public resolvers: ResolverList;

  constructor(args: IPageInfo) {
    Object.assign(this, args);
    this.resolvers = args.resolvers ?? {};
  }

  /**
   * Set Menu Route for PageInfo. This also modifies the menu route to include
   * the associated target component.
   */
  public setMenuRoute(target: Type<PageComponent>, menu: MenuRoute) {
    this.self = menu;
    this.component = target;
    this.route.pageComponent = target;
  }

  public get route() {
    return this.self.route;
  }
}
