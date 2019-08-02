import { Type } from "@angular/core";
import {
  PageInfoInterface,
  MenuLink,
  RouteFragment,
  Location,
  User,
  Menus,
  Category
} from "./layout-menus.interfaces";
import { Route } from "@angular/router";

export interface ComponentWithPageInfo extends Type<any> {
  pageInfo: PageInfo;
}

export class PageInfo implements PageInfoInterface, MenuLink {
  routeFragment: RouteFragment;
  uri: Location;
  tooltip: (user?: User) => string;
  predicate?: (user?: User) => boolean;
  icon: readonly [string, string];
  label: string;
  component: Type<any>;
  category: Category;
  menus: Menus;

  constructor(target: Type<any>, args: PageInfoInterface) {
    Object.assign(this, args);
    this.component = target;
    this.uri = ("/" + this.category.route + "/" + this.routeFragment) as Route;
  }
}

export function Page(info: PageInfoInterface) {
  return (constructor: Type<any>): Type<any> => {
    const staticInfo = new PageInfo(constructor, info);
    const modified = constructor as ComponentWithPageInfo;
    modified.pageInfo = staticInfo;

    return modified;
  };
}
