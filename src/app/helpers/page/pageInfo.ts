import { Type } from "@angular/core";
import { Data } from "@angular/router";
import { Category, MenuRoute, Menus } from "src/app/interfaces/menusInterfaces";

/**
 * Page info interface.
 * This stores information required to generate the various menus of the page.
 * Also stores metadata about the page, like the icon to use, and the route
 * for that page.
 * @extends MenuItem
 * @extends Data
 */
export interface PageInfoInterface extends Data {
  self: MenuRoute;
  category: Category;
  menus: Menus;
  fullscreen?: boolean;
}

/**
 * Page info class
 */
export class PageInfo implements PageInfoInterface {
  public self: MenuRoute;
  public component: Type<any>;
  public category: Category;
  public menus: Menus;
  public fullscreen: boolean;

  constructor(target: Type<any>, args: PageInfoInterface) {
    if (!args.self) {
      throw new Error("A page info must be provided with an `self` MenuRoute");
    }
    Object.assign(this, args);
    this.component = target;
    this.route.pageComponent = target;
  }

  get route() {
    return this.self.route;
  }
}
