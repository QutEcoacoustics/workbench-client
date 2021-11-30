import { Params } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  MenuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "@menu/widgetItem";
import { List } from "immutable";
import { SessionUser } from "../models/User";
import { StrongRoute } from "./strongRoute";

/**
 * Part of an (a single file/directory) internal angular route
 */
export type RouteFragment = string;

/**
 * External URL
 */
export type Href = (params?: Params) => string;

/**
 * Fontawesome icon. Eg. ['fas', 'home']. All icons used must be imported in app.module.ts.
 */
export type Icon = IconProp;

/**
 * Angular Resolvers.
 * Used to inject api models into route data.
 */
export interface ResolverList {
  [key: string]: string;
}

/**
 * Component Name and Icon
 */
export interface LabelAndIcon {
  /**
   * The icon to show for this resource
   */
  icon: Icon;
  /**
   * The label to show for this resource
   */
  label: string;
}

/**
 * Category interface
 *
 * @extends LabelAndIcon
 */
export interface Category extends LabelAndIcon {
  /**
   *  Local route of category Eg. 'security'
   */
  route: StrongRoute;
}

/**
 * Literal string choice type (like an enum) used for the `kind`
 * property in things derived from MenuItems.
 */
export type MenuItemKinds =
  | "MenuItem"
  | "MenuAction"
  | "MenuLink"
  | "MenuRoute";

/**
 * User callback function
 */
export type UserCallback<T> = null | ((user?: SessionUser, data?: any) => T);

/**
 * An item designed to be in a menu.
 * Do not use this directly, see the derived interfaces.
 *
 * @extends LabelAndIcon
 */
export interface MenuItem extends LabelAndIcon {
  kind: MenuItemKinds;

  /**
   * The tooltip that will be shown when context for this link is required.
   */
  tooltip: UserCallback<string>;
  /**
   * Whether or not to show this link.
   */
  predicate?: UserCallback<boolean>;
  /**
   * The order position of this link in comparison to others.
   */
  order?: number;
  /**
   * The indentation of this link
   */
  indentation?: number;
  /**
   * Force highlighting of this link, this is similar to setting the links `active`
   * property to true. This is needed for links which should appear active regardless
   * of current route, such as the page not found menu item.
   */
  highlight?: boolean;
  /**
   * Tracks whether this link, or one of its children is currently actively being displayed.
   * It allows the link to skip its predicate temporarily.
   */
  active?: boolean;
  /**
   * Tracks whether this link should be disabled, this will prevent the link from being
   * clicked on, and highlight it as disabled. If a string value is given, it will display
   * the message in addition to whatever the links tooltip is.
   */
  disabled?: boolean | string;
}

export function menuItem<T extends Omit<MenuItem, "kind">>(item: T): MenuItem {
  return Object.assign(item, { kind: "MenuItem" as const });
}

/**
 * MenuLink interface. Defines all the requirements of a href that points
 * to an external location, but not an internal route or page.
 * e.g. https://google.com.
 *
 * @extends MenuItem
 */
export interface MenuLink extends MenuItem {
  kind: "MenuLink";
  /**
   * The URL or fragment this link points to
   */
  uri: Href;
}

export function menuLink<T extends Omit<MenuLink, "kind">>(item: T): MenuLink {
  return Object.assign(item, {
    kind: "MenuLink" as const,
    active: false,
    indentation: 0,
  });
}

/**
 * MenuRoute interface. Defines an internal page/route within this application.
 * Must be known to this angular app. e.g. /security/login
 *
 * @extends MenuItem
 */
export interface MenuRoute extends MenuItem {
  kind: "MenuRoute";
  /**
   * The internal route this menu item points to
   */
  route: StrongRoute;

  /**
   * Menu parent
   */
  parent?: MenuRoute;
}

export function menuRoute<T extends Omit<MenuRoute, "kind">>(
  item: T
): MenuRoute {
  return Object.assign(item, {
    kind: "MenuRoute" as const,
    active: false,
    indentation: item.parent ? item.parent.indentation + 1 : 0,
    order: item.parent?.order ?? item.order,
  });
}

/**
 * Action Link interface. Defines all the requirements of an non-navigable menu
 * item. A button.
 *
 * @extends MenuItem
 */
export interface MenuAction extends MenuItem {
  kind: "MenuAction";
  action: () => any | void;
}

export function menuAction<T extends Omit<MenuAction, "kind">>(
  item: T
): MenuAction {
  return Object.assign(item, {
    kind: "MenuAction" as const,
    active: false,
    indentation: 0,
  });
}

/**
 * Any Menu Item discriminated union. This is used to store any of the
 *  menu item types together in a collection.
 */
export type AnyMenuItem =
  | MenuAction
  | MenuLink
  | MenuRoute
  | MenuModalWithoutAction
  | MenuModal;

/**
 * Any Menu Item  discriminated union. This is used to store any menu item,
 * that you can navigate to (i.e. not a button/action), together in a collection.
 */
export type NavigableMenuItem = MenuLink | MenuRoute;

/**
 * Determines if a menu item is a button (MenuAction)
 *
 * @param item Menu item
 */
export function isButton(item: any): item is MenuAction {
  return item.kind === "MenuAction";
}

/**
 * Determines if a menu item is part of the MenuItem interface
 *
 * @param item Menu item
 */
export function isInternalRoute(item: any): item is MenuRoute {
  return item.kind === "MenuRoute";
}

/**
 * Determines if a menu item is part of the MenuLink interface
 *
 * @param item Menu item
 */
export function isExternalLink(item: any): item is MenuLink {
  return item.kind === "MenuLink";
}

/**
 * Get link route. This is only required because typescript is unable to
 * properly type-check links in template.
 *
 * @param link Menu item
 * @returns Either full route, or uri
 */
export function getRoute(link: NavigableMenuItem, params?: Params): string {
  return isInternalRoute(link) ? link.route.toRouterLink() : link.uri(params);
}

/**
 * Determines if an object is part of the Navigable interface
 *
 * @param item Menu item
 */
export function isNavigableMenuItem(item: any): item is NavigableMenuItem {
  return isInternalRoute(item) || isExternalLink(item);
}

/**
 * MenusInfo interface. This stores information required to generate the
 * various menus attached to a component.
 *
 * @param actions List of actions
 * @param links List of secondary links
 */
export interface Menus {
  actions?: List<AnyMenuItem | MenuModalWithoutAction>;
  actionWidgets?: List<WidgetMenuItem>;
  links?: List<NavigableMenuItem | MenuModalWithoutAction>;
  linkWidgets?: List<WidgetMenuItem>;
}
