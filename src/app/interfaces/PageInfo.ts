import { Type } from "@angular/core";
import {
  Category,
  Icon,
  MenuRoute,
  Menus,
  Order,
  PageInfoInterface,
  RouteFragment,
  UserCallback
} from "./layout-menus.interfaces";

export interface PageComponentStatic
  extends Type<PageComponentInterface>,
    Type<any> {
  readonly pageInfo: PageInfo;
}

export interface PageComponentInterface {
  readonly pageInfo: PageInfo;
}

/**
 * Page info class
 */
export class PageInfo implements PageInfoInterface, MenuRoute {
  // discriminated union tag
  kind: "MenuRoute";

  routeFragment: RouteFragment;
  route: string;
  tooltip: UserCallback<string>;
  predicate: UserCallback<boolean>;
  icon: Icon;
  label: string;
  component: Type<any>;
  category: Category;
  menus: Menus;
  uri: RouteFragment;
  order: Order;
  fullscreen: boolean;

  constructor(target: Type<any>, args: PageInfoInterface) {
    Object.assign(this, args);
    this.kind = "MenuRoute";
    this.component = target;
  }
}

type DecoratedPageComponent = Type<PageComponentInterface> &
  PageComponentStatic;

// this mixin is needed because typescript decorators
// do not mutate the type signature they are applied to.
// See https://github.com/Microsoft/TypeScript/issues/4881
// If they did, then we wouldn't need this shim, which
// currently needs to be extended from in every component!
export class PageComponent implements PageComponentInterface {
  static get pageInfo() {
    return null;
  }
  get pageInfo() {
    return null;
  }
}

/**
 * Page info directive
 * @param info Page info
 */
export function Page(
  info: PageInfoInterface
): (constructor: Type<any>) => DecoratedPageComponent {
  // tslint:disable-next-line: only-arrow-functions
  return function PageDecorator(
    componentConstructor: Type<PageComponentInterface>
  ): DecoratedPageComponent {
    const staticInfo = new PageInfo(componentConstructor, info);

    // alternate implementation
    // return class extends componentConstructor implements PageComponent
    // {
    //     static get pageInfo() { return staticInfo; }
    //     get pageInfo() { return staticInfo; }
    // }

    Object.defineProperty(componentConstructor, "pageInfo", {
      value: staticInfo
    });
    Object.defineProperty(componentConstructor.prototype, "pageInfo", {
      value: staticInfo
    });

    // we know this conversion is correct
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    return <DecoratedPageComponent> componentConstructor;
  };
}
